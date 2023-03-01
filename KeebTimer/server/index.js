const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
  host: "localhost",
  user: "local_user",
  password: "password",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// creating the time tables on the home page
// NOTE: use 'connect' instead of nesting a get request because this will
//       always run when the app is launched, regardless of the URL / page
db.connect((err) => {
  if (err) throw err;
  const sqlCreateDb = "CREATE DATABASE IF NOT EXISTS KeebCompanion";
  db.query(sqlCreateDb, (err, result) => {
    if (err) throw err;
    const sqlUseDb = "USE kc_testing";
    // const sqlUseDb = "USE KeebCompanion";
    db.query(sqlUseDb, (err, result) => {
      if (err) throw err;
      // times table creation
      const sqlCreateTable = `CREATE TABLE IF NOT EXISTS times (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        total_time TIME,
        count INT,
        additional_notes VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
      )`;
      db.query(sqlCreateTable, (err, result) => {
        if (err) throw err;
        // timer_stats table creation
        const sqlCreateStats = `CREATE TABLE IF NOT EXISTS timer_stats (
          id INT PRIMARY KEY AUTO_INCREMENT,
          times_id INT NOT NULL,
          name VARCHAR(50) NOT NULL,
          curr_time TIME,
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (times_id) REFERENCES times(id) ON DELETE CASCADE
        )`;
        db.query(sqlCreateStats, (err, result) => {
          if (err) throw err;
          console.log("Initialization completed!");
        });
      });
    });
  });
});

// 1. INSERTING NEW TIMER INTO TIMES (i.e. start new timer initialization)
app.post("/api/post", (req, res) => {
  // THIS NAME HAS TO MATCH ARG IN CLIENT SIDE AXIOS POST
  const { timeName } = req.body;
  const sqlInsertNew = `INSERT INTO times SET 
  name = ?, total_time = '00:00:00', count = 0`;
  db.query(sqlInsertNew, [timeName], (err, result) => {
    if (err) throw err;
    // NOTE: we have to send a response otherwise the app will crash
    //       after the browser waits for 6 or more pending requests

    // this response (status 200) indicates successful request
    res.status(200).send();
  });
});

// 2. START NEW TIMER INITIAL VALUE QUERIES (i.e. based on id of most recent of name)
// 2.1. correct query to handle new timer values (i.e. no existing laps)
app.get("/api/getTimeNew/:name", (req, res) => {
  const { name } = req.params;
  // creating views for each of the desired columns
  // (queries will always return a value, even if none exist (null))
  // hour
  const sqlViewHrNew = `CREATE OR REPLACE VIEW view_hr_new AS 
  SELECT HOUR(curr_time) FROM timer_stats
  WHERE 
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)
  ORDER BY created_at DESC LIMIT 1`;
  // minute
  const sqlViewMinNew = `CREATE OR REPLACE VIEW view_min_new AS 
  SELECT MINUTE(curr_time) FROM timer_stats
  WHERE 
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)
  ORDER BY created_at DESC LIMIT 1`;
  // second
  const sqlViewSecNew = `CREATE OR REPLACE VIEW view_sec_new AS 
  SELECT SECOND(curr_time) FROM timer_stats
  WHERE 
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)
  ORDER BY created_at DESC LIMIT 1`;
  // creating views
  db.query(sqlViewHrNew, name, (err, result) => {
    if (err) throw err;
    db.query(sqlViewMinNew, name, (err, result) => {
      if (err) throw err;
      db.query(sqlViewSecNew, name, (err, result) => {
        if (err) throw err;
        // using views to find existing values, or return 0 otherwise
        const sqlGetTimeNew = `SELECT 
        IFNULL((SELECT * FROM view_hr_new), 0) AS hr_new,
        IFNULL((SELECT * FROM view_min_new), 0) AS min_new,
        IFNULL((SELECT * FROM view_sec_new), 0) AS sec_new
        `;
        db.query(sqlGetTimeNew, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      });
    });
  });
});

// 2.2. getting the count
app.get("/api/getCountNew/:name", (req, res) => {
  const { name } = req.params;
  const sqlGetCountNew = `SELECT COUNT(*) AS count_new FROM timer_stats
  WHERE 
  times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)`;
  db.query(sqlGetCountNew, name, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 3. GOING BACK TO HOME FROM START NEW TIMER PAGE (delete the curr timer in times)
app.delete("/api/deleteTimeNew/:name", (req, res) => {
  const { name } = req.params;
  const sqlDeleteTimeNew = `DELETE FROM times
  WHERE 
    name = ? ORDER BY created_at DESC LIMIT 1`;
  db.query(sqlDeleteTimeNew, name, (err, result) => {
    if (err) throw err;
    // this response (status 200) indicates successful request
    res.status(200).send();
  });
});

// 4. START NEW TIMER COUNTER FUNCTIONS; i.e. get id based on most recent of name
// 4.1. increment counter (add row into timer_stats)
app.post("/api/incrementNew", (req, res) => {
  const { timerName, currTime } = req.body;
  const sqlIncrementNew = `INSERT INTO timer_stats SET
    name = '${timerName}', 
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1),
    curr_time = ?`;
  db.query(sqlIncrementNew, [timerName, currTime], (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 4.2. decrement counter (remove most recent row with times_id from timer_stats)
// NOTE: delete requests must use req.params (i.e. path vars); req.body is ignored
app.delete("/api/decrementNew/:name", (req, res) => {
  const { name } = req.params;
  const sqlDecrementNew = `DELETE FROM timer_stats 
  WHERE 
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)
  ORDER BY created_at DESC LIMIT 1`;
  db.query(sqlDecrementNew, name, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 4.3. reset counter (remove ALL rows from timer_stats)
app.delete("/api/resetNew/:name", (req, res) => {
  const { name } = req.params;
  const sqlResetNew = `DELETE FROM timer_stats 
  WHERE 
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)`;
  db.query(sqlResetNew, name, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 5. START NEW TIMER SUBMISSION
// 5.1. getting submission values for new timer
app.get("/api/getSubmissionNew/:name", (req, res) => {
  const { name } = req.params;
  const sqlGetSubmissionNew = `SELECT 
    times.name AS time_name,
    IFNULL(MAX(curr_time), '00:00:00') AS total_time,
    COUNT(curr_time) AS count,
    IFNULL(additional_notes, '') AS additional_notes
  FROM times
  LEFT JOIN timer_stats 
    ON times.id = timer_stats.times_id
  GROUP BY times.id 
  HAVING
    times.id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)`;
  db.query(sqlGetSubmissionNew, name, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 5.2. handling submission (update new timer in times)
app.put("/api/submitTimerNew", (req, res) => {
  const { time_name, total_time, count, additional_notes } = req.body;
  // view to get the id of the new timer;
  // we can't use a subquery of a table when updating that table
  const sqlTimerIdNewView = `CREATE OR REPLACE VIEW new_timer_id AS
  SELECT id FROM times
  WHERE name = ? 
  ORDER BY created_at DESC LIMIT 1`;
  db.query(sqlTimerIdNewView, time_name, (err, result) => {
    if (err) throw err;
    const sqlSubmitTimerNew = `UPDATE times 
    SET 
      name = ?,
      total_time = ?,
      count = ?,
      additional_notes = ?
    WHERE id = (SELECT * FROM new_timer_id)`;
    db.query(
      sqlSubmitTimerNew,
      [time_name, total_time, count, additional_notes],
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  });
});

// 6. SAVED TIMER INITIAL VALUE QUERIES (i.e. based on passed times id)
// 6.1. getting the name
app.get("/api/getNameExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlGetNameNew = `SELECT name FROM times
  WHERE id = ?`;
  db.query(sqlGetNameNew, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 6.2. getting most recent lap
app.get("/api/getTimeExists/:id", (req, res) => {
  const { id } = req.params;
  // creating views for each of the desired columns
  // (queries will always return a value, even if none exist (null))
  // hour
  const sqlViewHrExists = `CREATE OR REPLACE VIEW view_hr_exists AS 
  SELECT HOUR(curr_time) FROM timer_stats
  WHERE 
    times_id = ?
  ORDER BY created_at DESC LIMIT 1`;
  // minute
  const sqlViewMinExists = `CREATE OR REPLACE VIEW view_min_exists AS 
  SELECT MINUTE(curr_time) FROM timer_stats
  WHERE 
    times_id = ?
  ORDER BY created_at DESC LIMIT 1`;
  // second
  const sqlViewSecExists = `CREATE OR REPLACE VIEW view_sec_exists AS 
  SELECT SECOND(curr_time) FROM timer_stats
  WHERE 
    times_id = ?
  ORDER BY created_at DESC LIMIT 1`;
  // creating views
  db.query(sqlViewHrExists, id, (err, result) => {
    if (err) throw err;
    db.query(sqlViewMinExists, id, (err, result) => {
      if (err) throw err;
      db.query(sqlViewSecExists, id, (err, result) => {
        if (err) throw err;
        // using views to find existing values, or return 0 otherwise
        const sqlGetTimeExists = `SELECT 
        IFNULL((SELECT * FROM view_hr_exists), 0) AS hr_exists,
        IFNULL((SELECT * FROM view_min_exists), 0) AS min_exists,
        IFNULL((SELECT * FROM view_sec_exists), 0) AS sec_exists
        `;
        db.query(sqlGetTimeExists, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      });
    });
  });
});

// 6.3. getting the count
app.get("/api/getCountExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlGetCountExists = `SELECT COUNT(*) AS count_exists FROM timer_stats
  WHERE 
    times_id = ?`;
  db.query(sqlGetCountExists, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 7. SAVED TIMER COUNTER FUNCTIONS; i.e. based on existing times id
// 7.1. increment counter (add row into timer_stats)
app.post("/api/incrementExists", (req, res) => {
  const { timerName, timerId, currTime } = req.body;
  const sqlIncrementExists = `INSERT INTO timer_stats SET
    name = '${timerName}', 
    times_id = ?,
    curr_time = ?`;
  db.query(sqlIncrementExists, [timerId, currTime], (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 7.2. decrement counter (remove most recent row with times_id from timer_stats)
// NOTE: delete requests must use req.params (i.e. path vars); req.body is ignored
app.delete("/api/decrementExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlDecrementExists = `DELETE FROM timer_stats 
  WHERE 
    times_id = ?
  ORDER BY created_at DESC LIMIT 1`;
  db.query(sqlDecrementExists, id, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 7.3. reset counter (remove ALL rows from timer_stats)
app.delete("/api/resetExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlResetNew = `DELETE FROM timer_stats 
  WHERE 
    times_id = ?`;
  db.query(sqlResetNew, id, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 8. SUBMITTING EXISTING TIMER AFTER EDIT
// 8.1. getting submission values for existing timer
app.get("/api/getSubmissionExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlGetSubmissionExists = `SELECT 
    times.name AS time_name,
    IFNULL(MAX(curr_time), '00:00:00') AS total_time,
    COUNT(curr_time) AS count,
    IFNULL(additional_notes, '') AS additional_notes
  FROM times
  LEFT JOIN timer_stats 
    ON times.id = timer_stats.times_id
  GROUP BY times.id 
  HAVING
    times.id = ?`;
  db.query(sqlGetSubmissionExists, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 8.2. handling submission (update new timer in times)
app.put("/api/submitTimerExists", (req, res) => {
  const { id, time_name, total_time, count, additional_notes } = req.body;
  // update name in laps
  const sqlUpdateLapName = `UPDATE timer_stats
  SET name = ?
  WHERE times_id = ?`;
  db.query(sqlUpdateLapName, [time_name, id], (err, result) => {
    if (err) throw err;
    const sqlSubmitTimerExists = `UPDATE times 
    SET 
      name = ?,
      total_time = ?,
      count = ?,
      additional_notes = ?
    WHERE id = ?`;
    db.query(
      sqlSubmitTimerExists,
      [time_name, total_time, count, additional_notes, id],
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  });
});

// 9. SAVED TIMES CRUD API CALLS
// 9.1. getting all of the saved times to display in the CRUD table
app.get("/api/getSavedTimes", (req, res) => {
  const sqlGetSavedTimes = "SELECT * FROM times";
  db.query(sqlGetSavedTimes, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 9.2. deleting a time
app.delete("/api/deleteTimeExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlDeleteTimeExists = "DELETE FROM times WHERE id = ?";
  db.query(sqlDeleteTimeExists, id, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 9.3. deleting all times
app.delete("/api/deleteAllTimes", (req, res) => {
  const sqlDeleteAllTimes = "DELETE FROM times";
  db.query(sqlDeleteAllTimes, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// 9.4. viewing individual time
app.get("/api/viewTime/:id", (req, res) => {
  const { id } = req.params;
  const sqlViewTime = "SELECT * FROM times WHERE id = ?";
  db.query(sqlViewTime, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 10. VIEW MORE DETAILS OF SAVED TIMER
// 10.1. getting laps for a timer
app.get("/api/viewLaps/:id", (req, res) => {
  const { id } = req.params;
  const sqlViewLaps = "SELECT * FROM timer_stats WHERE times_id = ?";
  db.query(sqlViewLaps, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 10.2. getting lap stats for a timer
app.get("/api/viewStats/:id", (req, res) => {
  const { id } = req.params;
  // view to get the lap differences between times for a timer
  const sqlLapDiffs = `CREATE OR REPLACE VIEW lap_diffs AS 
  SELECT
    name,
    IFNULL(
      TIMEDIFF(curr_time, LAG(curr_time) OVER (PARTITION BY name ORDER BY curr_time)), 
      curr_time) AS lap_diff
  FROM timer_stats
  WHERE times_id = ?`;
  db.query(sqlLapDiffs, id, (err, result) => {
    if (err) throw err;
    // computing statistics from the lap differences
    const sqlLapStats = `SELECT
      name, 
      COUNT(*) AS count,
      MIN(lap_diff) AS min_diff,
      MAX(lap_diff) AS max_diff,
      SEC_TO_TIME(TRUNCATE(AVG(TIME_TO_SEC(lap_diff)), 0)) AS avg_diff
    FROM lap_diffs
    GROUP BY name`;
    db.query(sqlLapStats, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
});

app.listen(5000, function () {
  console.log("Server running on port 5000!");
});
