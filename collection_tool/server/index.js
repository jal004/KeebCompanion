/** this file contains all of the backend logic for the web app
 * this includes, but is not limited to:
 * - import statements and setup
 * - app to mysql connection
 * - various express routes for each of the tools
 */

/** tool 1: collection CRUD page
 *  - this will be done with a single table that has a column
 *    to distinguish item type
 *  - this page will display a table with the following functionality:
 *    - a "create" button to create a new row; users will fill out a form
 *    - a "delete" button which will ask for an id of the row(s) to delete
 *      - NOTE: this is a shortcoming; I eventually want to have a
 *              button next to each row to delete
 *    - an "edit" button to update a row based on id
 *    - a "search" button to find rows based on a specified column value
 */

/** import statements */
var express = require("express");
var mysql = require("mysql2");
var bodyParser = require("body-parser");
var cors = require("cors");

/** initial webapp setup */
var app = express();
app.use(cors());
app.use(express.json());

// this is required to access post values in the post route below
app.use(bodyParser.urlencoded({ extended: true }));

// this is required for accessing the css file in the public dir with views
app.use(express.static(__dirname + "/public"));

// creating server on port 8080
app.listen(8080, function () {
  // DEBUG
  console.log("Server running on port 8080!");
});

/** mysql connection */
var connection = mysql.createConnection({
  host: "localhost",
  user: "local_user",
  password: "password",
});

// DEBUG
// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Successfully connected to the database!");
// });

/** routes in webapp */
/** home page
 *  - creates the local database, if it does not already exist
 *  - uses the database and creates the collection table, if it does not already exist
 */
app.get("/", (req, res) => {
  let db_name = "keeb_companion_db";
  let createDbQuery = `CREATE DATABASE IF NOT EXISTS ${db_name}`;

  // creating local database
  connection.query(createDbQuery, (err, result) => {
    if (err) throw err;
    // DEBUG
    // console.log(`Successfully created database ${db_name}!`);

    let useDbQuery = `USE ${db_name}`;
    connection.query(useDbQuery, (err, result) => {
      if (err) throw err;
      // DEBUG
      // console.log(`Using database ${db_name}!`);
      let createTableQuery = `CREATE TABLE IF NOT EXISTS collection ( 
        id INT PRIMARY KEY AUTO_INCREMENT, 
        item_name VARCHAR(100) NOT NULL, 
        quantity INT NOT NULL, 
        item_type VARCHAR(50) NOT NULL, 
        price DOUBLE NOT NULL,
        additional_notes VARCHAR(255), 
        created_at TIMESTAMP DEFAULT NOW() 
      )`;
      connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        // DEBUG
        // console.log("Successfully created the collection table!");
      });
    });
  });

  // DEBUG
  console.log("REQUESTED THE home ROUTE!");
  res.send("This is the home page!");
});

// route to display the collection table
app.get("/api/get", (req, res) => {});
