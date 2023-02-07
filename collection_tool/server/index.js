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
        quantity INT NOT NULL, 
        item_type VARCHAR(50) NOT NULL, 
        price DOUBLE NOT NULL,
        additional_notes VARCHAR(255), 
        created_at TIMESTAMP DEFAULT NOW() 
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

app.listen(5000, function () {
  console.log("Server running on port 5000!");
});
