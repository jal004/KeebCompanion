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
  res.send("Hello world!");
});

// displaying crud table on home page
app.get("/api/get", (req, res) => {
  const sqlCreateDb = "CREATE DATABASE IF NOT EXISTS KeebCompanion";
  db.query(sqlCreateDb, (err, result) => {
    if (err) throw err;
    const sqlUseDb = "USE KeebCompanion";
    db.query(sqlUseDb, (err, result) => {
      if (err) throw err;
      const sqlCreateTable = `CREATE TABLE IF NOT EXISTS collection ( 
        id INT PRIMARY KEY AUTO_INCREMENT, 
        item_name VARCHAR(100) NOT NULL, 
        quantity VARCHAR(100) NOT NULL, 
        item_type VARCHAR(50) NOT NULL, 
        price VARCHAR(100) NOT NULL,
        additional_notes VARCHAR(255), 
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW() 
      )`;
      db.query(sqlCreateTable, (err, result) => {
        if (err) throw err;
        const sqlGet = "SELECT * FROM collection";
        db.query(sqlGet, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      });
    });
  });
});

// fetching existing data into form to edit row
app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM collection WHERE id = ?";
  db.query(sqlGet, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// inserting new row
app.post("/api/post", (req, res) => {
  const { item_name, quantity, item_type, price, additional_notes } = req.body;
  const sqlInsert = `INSERT INTO collection
    (item_name, quantity, item_type, price, additional_notes) 
    VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sqlInsert,
    [item_name, quantity, item_type, price, additional_notes],
    (err, result) => {
      if (err) throw err;
    }
  );
});

// updating existing row
app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { item_name, quantity, item_type, price, additional_notes } = req.body;
  const sqlUpdate = `UPDATE collection SET 
    item_name = ?, quantity = ?, item_type = ?, price = ?, additional_notes = ? 
    WHERE id = ?`;
  db.query(
    sqlUpdate,
    [item_name, quantity, item_type, price, additional_notes, id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// deleting a row
app.delete("/api/remove/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM collection WHERE id = ?";
  db.query(sqlRemove, id, (err, result) => {
    if (err) throw err;
  });
});

// additional views of the table in the home page
// view table by type
app.get("/api/getByType", (req, res) => {
  const sqlGetByType =
    "SELECT * FROM collection ORDER BY item_type, price DESC";
  db.query(sqlGetByType, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// view stats by type
app.get("/api/getStats", (req, res) => {
  const sqlGetStats = `SELECT 
      item_type, 
      MIN(CAST(price AS DOUBLE)) AS min_price, 
      MAX(CAST(price AS DOUBLE)) AS max_price, 
      AVG(price) AS avg_price, 
      MIN(CAST(quantity AS DOUBLE)) AS min_quantity, 
      MAX(CAST(quantity AS DOUBLE)) AS max_quantity, 
      TRUNCATE(AVG(quantity), 0) AS avg_quantity 
      FROM collection 
    GROUP BY item_type 
    ORDER BY item_type;`;
  db.query(sqlGetStats, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// view table by price
app.get("/api/getByPrice", (req, res) => {
  const sqlGetByPrice = `SELECT * FROM collection 
    ORDER BY 
      CAST(price AS DOUBLE) DESC, 
      CAST(quantity AS DOUBLE) DESC,
      item_name`;
  db.query(sqlGetByPrice, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// view table by quantity
app.get("/api/getByQuantity", (req, res) => {
  const sqlGetByPrice = `SELECT * FROM collection 
    ORDER BY  
      CAST(quantity AS DOUBLE) DESC,
      CAST(price AS DOUBLE) DESC,
      item_name`;
  db.query(sqlGetByPrice, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// deleting all rows
app.delete("/api/removeAll", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM collection";
  db.query(sqlRemove, (err, result) => {
    if (err) throw err;
  });
});

app.listen(5000, function () {
  console.log("Server running on port 5000!");
});
