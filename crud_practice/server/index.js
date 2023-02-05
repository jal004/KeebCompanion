const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "local_user",
  password: "password",
  database: "crud_practice",
});

app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM contacts";
  db.query(sqlGet, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/post", (req, res) => {
  const { name, email, contact } = req.body;
  // syntax for multi variable dynamic insertion
  const sqlInsert =
    "INSERT INTO contacts (name, email, contact) VALUES (?, ?, ?)";
  db.query(sqlInsert, [name, email, contact], (err, result) => {
    if (err) throw err;
  });
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000!");
});
