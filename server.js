var mysql = require("mysql");
var inquirer = require("inquirer");

require("dotenv").config();

const db = require("db")
db.connect({

    host: process.env.DB_HOST, 

    port: 3306,

    user: process.env.DB_USER,

    pasword: process.env.DB_PASS
});