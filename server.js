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
    password: 'password',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
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

addDepartment = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'department',
      message:'What department do you want to add?',
    }
  ])
  .then(answer => {
    db.query(`INSERT INTO department (name) VALUES (?)`, answer.department, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('Successfully added ' + answer.department + " to departments");
      init();
    });
  });
}

addRole = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'title',
      message:'What job title do you want to add?',
    },
    {
      type:'input',
      name:'salary',
      message:'What is the salary for that role?',
    }
  ])
  .then(answer => {
    db.query(`SELECT id, name FROM department`, (err, results) => {
      if (err) return console.log(err);
      const departmentVar = results.map((ele) => { return  {name: ele.name, value: ele.id }});

      inquirer.prompt([
        {
          type:'list',
          name:'department',
          message:'Which department does this role belongs to?',
          choices: departmentVar
        }
      ]).then(departmentVarAnswer => {
        db.query(`INSERT INTO role (id, title,salary,department_id) VALUES (?,?,?,?)`, [answer.roleId, answer.title, answer.salary, departmentVarAnswer.department],(err, results) => {
          if (err) {
            console.log(err);
          }
          console.log('Successfully added ' + answer.title +  ' to roles');
          init();
        });
      });
    }); 
  }); 
}

addEmployee = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'firstName',
      message:`What is the employee's first name?`,
    },
    {
      type:'input',
      name:'lastName',
      message:`What is the employee's last name?`,
    }
  ])
  .then(answer => {
    db.query(`SELECT id, title FROM role`, (err, results) => {
      if (err) return console.log(err);
      const roleVar = results.map((ele) => { return  {name: ele.title, value: ele.id }});

      inquirer.prompt([
        {
          type:'list',
          name:'role',
          message:`What is employee's role?`,
          choices: roleVar
        }
      ])
      .then(roleAnswer => {
        db.query(`SELECT first_name, last_name, id FROM employee`, (err, results) => {
          if (err) return console.log(err);
          const managerVar = results.map((ele) => { return  {name: ele.first_name + ''+ ele.last_name, value: ele.id }});
          const managerOption = {name:'null', value:null};
          managerVar.push(managerOption);

          inquirer.prompt([
            {
              type:'list',
              name:'manager',
              message:`Who is employee's manager?`,
              choices: managerVar
            }
          ])
          .then(ManagerAnswer => {
            db.query(`INSERT INTO employee (first_name, last_name,role_id, manager_id) VALUES (?,?,?,?)`, [answer.firstName, answer.lastName, roleAnswer.role,ManagerAnswer.manager],(err, results) => {
              if (err) {
                console.log(err);
              }
              console.log('Successfully added ' + answer.firstName + ' '+ answer.lastName +  ' to employee');
              init();
            });
          });
        }); 
      }); 
    }); 
  }); 
}

updateEmployeeRole = () => {
  db.query(`SELECT id, first_name, last_name FROM employee`, (err, results) => {
    if (err) return console.log(err);
    const employeeVar = results.map((ele) => { return  {name: ele.first_name + ' ' + ele.last_name, value: ele.id }});

    inquirer.prompt([
      {
        type:'list',
        name:'updateEmployee',
        message:`Which employee's role do you want to update?`,
        choices: employeeVar
      }
    ])
    .then(employeeAnswer => {
      db.query(`SELECT id, title FROM role`, (err, results) => {
        if (err) return console.log(err);
        const roleVar = results.map((ele) => { return  {name: ele.title, value: ele.id }});

        inquirer.prompt([
          {
            type:'list',
            name:'updateRole',
            message:`Which role do you want to assign the selected employee?`,
            choices: roleVar
          }
        ])
        .then(updateRoleAnswer => {
          db.query(`UPDATE employee SET role_id = (?) WHERE id = (?)`,[updateRoleAnswer.updateRole, employeeAnswer.updateEmployee], (err, results) => {
            if (err) {
              console.log(err);
            }
            console.log('Successfully updated role.');
            init();
          });
        });
      });
    });  
  }); 
}

exit= () =>{
  db.end();
}

init();