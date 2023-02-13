const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Zhou7247',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

const menuOptions = [
  {
    type: 'list',
    name: 'choices',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  }
]

function init(){
  inquirer.prompt(menuOptions).then((response)=>{
    if(response.choices === 'View all departments') {
      viewDepartments();
    } else if (response.choices === 'View all roles') {
      viewAllRoles();
    } else if (response.choices === 'View all employees') {
      viewAllEmployee();
    } else if (response.choices === 'Add a department') {
      addDepartment();
    } else if (response.choices === 'Add a role') {
      addRole();
    } else if (response.choices === 'Add an employee') {
      addEmployee();
    } else if (response.choices === 'Update an employee role') {
      updateEmployeeRole();
    } else if (response.choices === 'Exit'){
      exit();
    }
  });
}

viewDepartments = () => {
  db.query('SELECT * FROM department', (err, result) => {
    if (err) return console.log(err);
    console.table(result);
    init();
  });
}

viewAllRoles = () => {
  const mysql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id;`;
  db.query(mysql, (err, result) => {
    if (err) return console.log(err);
    console.table(result);
    init();
  });
}

viewAllEmployee = () => {
  const mysql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary,
    CONCAT(manager.manager_first_name, " " , manager.manager_last_name) as manager FROM employee LEFT JOIN ( SELECT employee.id AS employee_id,
    employee.first_name AS employee_first_name, employee.last_name AS employee_last_name, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name, manager.id AS manager_id
    FROM employee JOIN employee manager ON employee.manager_id = manager.id) as manager on employee.id = manager.employee_id INNER JOIN role on role.id = employee.role_id INNER JOIN department on role.department_id = department.id;`;
  db.query(mysql, (err, result) => {
    if (err) return console.log(err);
    console.table(result);
    init();
  });
}


init();