var mysql = require("mysql");
var inquirer = require("inquirer");

require("dotenv").config();

const mainTable = require("console.table");

const connection = mysql.createConnection({

    host: process.env.DB_HOST, 

    user: process.env.DB_USER,

    port: 4000,

    pasword: process.env.DB_PASS,

    database: "emsDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action", 
            type: "rawlist", 
            message: "What would you like to do?", 
            choices: [
                "Add Departments", 
                "Add Employees", 
                "Add Roles", 
                "Update Employee Roles",
                "View Departments", 
                "View Employees", 
                "View Roles",
                "Exit" 
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Add Departments":
                    addDepartments();
                    break;

                case "Add Employees":
                    addEmployees();
                    break;
                
                case "Add Roles":
                    addRoles();
                    break;
                
                case "Update Employee Roles":
                    updateRoles();
                    break;

                case "View Departments":
                    viewDepartments();
                    break;
                
                case "View Employees":
                    viewEmployees();
                    break;
                
                case "View Roles":
                    viewRoles();
                    break;
                
                case "Exit":
                    connection.end();
                    break;
            };
        });
};

function addDepartments() {
    inquirer
        .prompt([
            {
                name: "addDept",
                type: "input",
                message: "What department would you like to add?"
            }
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    department: answer.name
                },
                function(err) {
                    if (err) throw err;
                    console.log("New department added successfully.");
                    runSearch();
                }
            )
        })
};

function addEmployees() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name of the employee?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name of the employee?"
            },
            {
                name: "roleId",
                type: "input",
                message: "What is the employee's ID?"
            },
            {
                name: "mngId",
                type: "input",
                message: "What is the ID of the employee's manager?"
            },
            
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.mngId
                },
                function(err) {
                    if (err) throw err;
                    console.log("New employee added successfully.");
                    runSearch();
                }
            )
        })
};

function addRoles() {
    inquirer
        .prompt([
            {
                name: "newTitle",
                type: "input",
                message: "What is the title of the new role?"
            },
            {
                name: "newSalary",
                type: "input",
                message: "What is the salary of the new role?"
            },
            {
                name: "departId",
                type: "input",
                message: "What is the department ID of the new role?"
            }
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.mngId
                },
                function(err) {
                    if (err) throw err;
                    console.log("New employee added successfully.");
                    runSearch();
                }
            )
        })
};

function updateRoles() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err
        console.table(res)
        inquirer
            .prompt([
                {
                    type: "number",
                    message: "What is the employee's ID you wish to change roles?",
                    name: "ogId"
                },
                {
                    type: "number", 
                    message: "What is the new role ID of said employee?",
                    name: "roleId"
                }
            ])
            .then(ansewr => {
                const query = `UPDATE employee SET role_id = "${answer.roleId}" WHERE id = ${answer.ogId}`
                connection.query(query, function (err, res) {
                    if (err) throw err
                    console.log("Role Successfully Updated")
                    runSearch();
                })
            })
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        if(err) {
            throw err;
        }
        console.table(data);
        runSearch();
    })
};

function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, data) {
        if(err) {
            throw err;
        }
        console.table(data);
        runSearch();
    })
};

function viewRoles() {
    connection.query("SELECT * FROM role", function(err, data) {
        if(err) {
            throw err;
        }
        console.table(data);
        runSearch();
    })
}