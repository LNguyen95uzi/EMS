var mysql = require("mysql");
var inquirer = require("inquirer");
var util = require("util");

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const connection = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    pasword: process.env.DB_PASS,

    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) {
        console.log("Error connection: " + err.stack);
        return;
    };
    console.log("Connected as ID " + connection.threadId);
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "mainMenu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "View Department",
                "Add Employee",
                "View Employee",
                "Add Role",
                "Update Employee Role",
                "View Role",
                "Exit"
            ]
        })
        .then(function (answer) {
            if (answer.mainMenu === "Add Departmnet") {
                addDepartment();
            } else if (answer.mainMenu === "View Department") {
                viewDepartment();
            } else if (answer.mainMenu === "Add Employee") {
                addEmployee();
            } else if (answer.mainMenu === "View Employee") {
                viewEmployee();
            } else if (answer.mainMenu === "Add Role") {
                addRole();
            } else if (answer.mainMenu === "View Role") {
                viewRole();
            } else if (answer.mainMenu === "Update Employee Role") {
                updateRole();
            } else {
                connection.end();
            };
        });
};
//             switch (answer.mainMenu) {
//                 case "Add Departments":
//                     addDepartments();
//                     break;

//                 case "Add Employees":
//                     addEmployees();
//                     break;

//                 case "Add Roles":
//                     addRoles();
//                     break;

//                 case "Update Employee Roles":
//                     updateRoles();
//                     break;

//                 case "View Departments":
//                     viewDepartments();
//                     break;

//                 case "View Employees":
//                     viewEmployees();
//                     break;

//                 case "View Roles":
//                     viewRoles();
//                     break;

//                 case "Exit":
//                     connection.end();
//                     break;
//             };
//         });
// };

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "addDept",
                type: "input",
                message: "What department would you like to add?"
            }
        ])
        .then(function (deptAnswer) {
            let departmentName = deptAnswer.departmentName;
            connection.query(
                "INSERT INTO department(name) VALUES(?)",
                {
                    departmentName
                },
                function (err, data) {
                    if (err) {
                        throw err;
                    };
                    console.log(`${departmentName} was added successfully!`);
                    runSearch();
                }
            )
        })
};

function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, rows) {
        if (err) {
            throw err;
        };
        rows.forEach(function (row) {
            console.table(`ID:${row.id} Department Name: ${row.name}`)
        });
        runSearch();
    })
};


function addEmployee() {
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
        .then(function (empAnswer) {
            var first = empAnswer.firstName;
            var last = empAnswer.lastName;
            var role = empAnswer.roleId;
            var managerId = empAnswer.mngId;

            connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${first}", "${last}", ${role}, ${managerId})`,
                function (err, data) {
                    if (err) {
                        throw err;
                    }
                    console.log(`${first} added!`);
                    runSearch();
                });
            // connection.query(
            //     "INSERT INTO employee SET ?",
            //     {
            //         first_name: answer.firstName,
            //         last_name: answer.lastName,
            //         role_id: answer.roleId,
            //         manager_id: answer.mngId
            //     },
            //     function (err) {
            //         if (err) throw err;
            //         console.log("New employee added successfully.");
            //         runSearch();
            //     }
            // )
        });
};

function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, rows) {
        if (err) {
            throw err;
        }
        rows.forEach(function (row) {
            console.table(`ID: ${row.id} | Name: ${row.first_name} ${row.last_name} | Role ID: ${row.role_id} | Manager ID: ${row.manager_id}`)
        });
        runSearch();
    })
};

function addRole() {
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
        .then(function (addRoleAnswer) {
            var role = addRoleAnswer.newTitle;
            var salary = addRoleAnswer.newSalary;
            var deptId = addRoleAnswer.departId;
            connection.query(
                `INSERT INTO role(title, salary, department_id) VALUES("${role}", ${salary}, ${deptId})`,
                function (err, data) {
                    if (err) {
                        throw err;
                    };
                    console.log(`${role} was added!`);
                    runSearch();
                }
            )
        })
};

function updateRole() {
    connection.query("SELECT * FROM employee", function (err, rows) {
        if (err){
            throw err;
        } 
        console.table(rows);
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the employee's ID you wish to change roles?",
                    name: "ogId"
                },
                {
                    type: "input",
                    message: "What is the new role ID of said employee?",
                    name: "newRoleId"
                }
            ])
            .then(function(res){
                connection.query(`UPDATE employee SET role_id = ${res.newRoleId}`, 
                function(err){
                    if(err) {
                        throw err;
                    }
                    console.log("Role has been updated!");
                    runSearch();
                })
            })
    })
};


function viewRole() {
    connection.query("SELECT * FROM role", function (err, rows) {
        if (err) {
            throw err;
        }
        rows.forEach(function(row){
            console.table(`ID: ${row.id} | Role Name: ${row.title} | Salary: ${row.salary} | Department ID: ${row.department_id}`)
        });
        runSearch();
    })
}