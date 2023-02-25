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

// test query
app.get("/api/getTest", (req, res) => {
  const sqlTest = "SELECT * FROM times";
  db.query(sqlTest, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// NEW TIMER QUERIES (i.e. based on id of most recent of name)
// getting most recent lap
app.get("/api/getTimeNew/:name", (req, res) => {
  const { name } = req.params;
  const sqlGetTimeNew = `SELECT 
    IFNULL(HOUR(curr_time), 0) AS hr_new,
    IFNULL(MINUTE(curr_time), 0) AS min_new,
    IFNULL(SECOND(curr_time), 0) AS sec_new
  FROM timer_stats
  WHERE
    times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)
  ORDER BY created_at DESC LIMIT 1`;
  db.query(sqlGetTimeNew, name, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// getting the count
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

// EXISTING TIMER QUERIES (i.e. based on times id)
// getting most recent lap
app.get("/api/getTimeExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlGetTimeExists = `SELECT 
    IFNULL(HOUR(curr_time), 0) AS hr_exists,
    IFNULL(MINUTE(curr_time), 0) AS min_exists,
    IFNULL(SECOND(curr_time), 0) AS sec_exists
  FROM timer_stats
  WHERE
    times_id = ?
  ORDER BY created_at DESC LIMIT 1`;
  db.query(sqlGetTimeExists, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// getting the count
app.get("/api/getCountExists/:id", (req, res) => {
  const { id } = req.params;
  const sqlGetCountExists = `SELECT COUNT(*) AS count_exists FROM timer_stats
  WHERE 
    times_id = ?`;
  db.query(sqlGetCountExists, id, (req, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// TEST QUERIES:
// NOTE: these queries are for testing if dynamic queries can be applied to
//       variables in sub queries

// it works!
// app.get("/api/getTimeNewTest", (req, res) => {
//   const name = "testing";
//   const sqlGetTimeNew = `SELECT
//     IFNULL(HOUR(curr_time), 0),
//     IFNULL(MINUTE(curr_time), 0),
//     IFNULL(SECOND(curr_time), 0)
//   FROM timer_stats
//   WHERE
//     times_id = (SELECT id FROM times WHERE name = ? ORDER BY created_at DESC LIMIT 1)
//   ORDER BY created_at DESC LIMIT 1`;
//   db.query(sqlGetTimeNew, name, (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

app.listen(5000, function () {
  console.log("Server running on port 5000!");
});
