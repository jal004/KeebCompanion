/** this file contains all of the backend logic for the web app
 * this includes, but is not limited to:
 * - import statements and setup
 * - app to mysql connection
 * - various express routes for each of the tools
 */

/** import statements */
var express = require("express");
var mysql = require("mysql2");
var bodyParser = require("body-parser");

/** initial webapp setup */
var app = express();
app.set("view engine", "ejs");

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
 *  - displays four buttons corresponding to each of the four
 *    tools for the user to navigate to
 */
app.get("/", function (req, res) {
  let db_name = "keeb_companion_db";
  let createQuery = `CREATE DATABASE IF NOT EXISTS ${db_name}`;

  // creating local database
  connection.query(createQuery, function (err, result) {
    if (err) throw err;
    // DEBUG
    // console.log(`Successfully created database ${db_name}!`);

    let useQuery = `USE ${db_name}`;
    connection.query(useQuery, function (err, result) {
      if (err) throw err;
      // DEBUG
      // console.log(`Using database ${db_name}!`);
    });
  });

  // DEBUG
  console.log("REQUESTED THE home ROUTE!");
  res.send("This is the home page!");
});

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
// get route; reading / viewing collection
app.get("/collection", function (req, res) {
  // DEBUG
  console.log("REQUESTED THE collection ROUTE!");
  res.send("This is the collection page!");
});

// post route; creating item to add to collection
app.post("/collectionCreate", function (req, res) {
  console.log("POST REQUEST SENT TO THE collectionCreate ROUTE!");
});

// post route; updating existing item in collection
app.post("/collectionUpdate", function (req, res) {
  console.log("POST REQUEST SENT TO THE collectionUpdate ROUTE!");
});

// post route; deleting existing item in collection
app.post("/collectionDelete", function (req, res) {
  console.log("POST REQUEST SENT TO THE collectionDelete ROUTE!");
});

/** tool 2: sales CRUD page */
// get route; reading / viewing sales
app.get("/sales", function (req, res) {
  // DEBUG
  console.log("REQUESTED THE sales ROUTE!");
  res.send("This is the sales page!");
});

// post route; creating item to add to sales
app.post("/salesCreate", function (req, res) {
  console.log("POST REQUEST SENT TO THE salesCreate ROUTE!");
});

// post route; updating existing item in sales
app.post("/salesUpdate", function (req, res) {
  console.log("POST REQUEST SENT TO THE salesUpdate ROUTE!");
});

// post route; deleting existing item in sales
app.post("/salesDelete", function (req, res) {
  console.log("POST REQUEST SENT TO THE salesDelete ROUTE!");
});

/** tool 3: group_buys CRUD page */
// get route; reading / viewing sales
app.get("/group_buys", function (req, res) {
  // DEBUG
  console.log("REQUESTED THE group_buys ROUTE!");
  res.send("This is the group_buys page!");
});

// post route; creating item to add to sales
app.post("/gbsCreate", function (req, res) {
  console.log("POST REQUEST SENT TO THE gbsCreate ROUTE!");
});

// post route; updating existing item in sales
app.post("/gbsUpdate", function (req, res) {
  console.log("POST REQUEST SENT TO THE gbsUpdate ROUTE!");
});

// post route; deleting existing item in sales
app.post("/gbsDelete", function (req, res) {
  console.log("POST REQUEST SENT TO THE gbsDelete ROUTE!");
});
