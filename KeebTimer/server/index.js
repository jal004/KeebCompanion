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

db.connect((err) => {
  if (err) throw err;
  console.log("Successfully connected to local MySQL database!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5000, function () {
  console.log("Server running on port 5000!");
});
