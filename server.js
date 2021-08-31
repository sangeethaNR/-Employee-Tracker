const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
require('dotenv').config();
const express = require('express');
const { response } = require("express");
const app = express();

var dbConnection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
//middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const roles =[];

getRoles();
 function  getRoles()
{

    dbConnection.query('SELECT title  FROM roles', function (err, results) {
        //console.log(results);
        Object.keys(results).forEach(function(key) {
            var row = results[key];
            roles.push(row.title)
          });
         // console.log(roles)
        init();
      });
   
}

function init()
{
    inquirer.prompt([{

        type: "list",
        message: "What would you like to do?",
        name: "options",
        choices: [
            'View All Employee',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Departments'
        ]


    }]).then(function(response){
        switch(response.options){
            case 'View All Employee':
                viewEmployee();
                break;
            case 'Add Employee':
                addEmployee();
                break;
           case  'Update Employee Role' :
                    UpdateEmployeeRole();
                    break;
        case  'View All Roles':
            viewRoles();
                  
                    break;
                case   'Add Role':
                    addRole();
                    break;
                
                case 'View All Departments':
                    viewDepartment();
                    break;
                case    'Add Departments':
                    addDepartment();
                    break;
        }
    }) ;
}

function viewEmployee(){

    dbConnection.query("SELECT * FROM employee",
    function (err, results) {
      if (err) throw err
      console.table(results)
      init();
    })
};
function addDepartment()
{
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'empFirstName',
            validate :(value) => {if(value) return true; else return `Please enter employee's first name  to continue` }
          }
    ])
}
//add Employee function

function addEmployee(){
    

//     Object.keys(results).forEach(function(key) {
//         var row = results[key];
//         roles.push(row.title)
dbConnection.query(`SELECT * FROM roles `, async (err, results) => {
    if (err) throw err;
    const role = await results.map(({
     id,
      title     
    }) => ({
      name: title,
      value: id
    }));
 
    dbConnection.query(`SELECT * FROM employee `, async (err, results) => {
      if (err) throw err;
      const managers = await results.map(({
       id,
        first_name,
        last_name       
      }) => ({
        name: first_name +`\t`+ last_name,
        value: id
      }));
   
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'empFirstName',
            validate :(value) => {if(value) return true; else return `Please enter employee's first name  to continue` }
          },
          {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'empLastName',
            validate :(value) => {if(value) return true; else return `Please enter employee's last name  to continue` }
          },
          {
            type: 'list',
            message: "What is the employee's role?",
            name: 'empRole',
            choices:role,
            validate :(value) => {if(value) return true; else return `Please select role to continue` }
           },
           {
            type: 'list',
            message: "Who  is the employee's Manager?",
            name: 'empManager', 
            choices :managers,
            validate :(value) => {if(value) return true; else return `Please select   to continue` }
          }]).then(function(res){
              const name = res.empFirstName + "" + res.empLastName;
            var sql = "INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";  
            var value = [res.empFirstName,res.empLastName,res.empRole,res.empManager];
           
            dbConnection.query(sql, value, function (err, result) {  
            if (err) throw err;  
            console.log("Successfully added " +name);  
            });  
          

         
       })

    })
})
  //})
}
function UpdateEmployeeRole(){ //1
    let selectedEmp ;
    dbConnection.query(`SELECT * FROM employee`, (err, response) => { //2 })
        if (err) throw err;
    
        const employeeList = response.map(({
          id,
          first_name,
          last_name
        }) => ({
          name: first_name + " " + last_name,
          value: id
        }));
        inquirer.prompt([{
            type: 'list',
            name: 'empName',
            message: "Select an Employee to Update their Role",
            choices: employeeList,
            validate :(value) => {if(value) return true; else return `Please select   to continue` }
          }]).then(function(res){  // 3 })
 selectedEmp =res.empName;
dbConnection.query(`SELECT * FROM roles`, (err, response) => { // 4 })
    if (err) throw err;

    const roles = response.map(({
      id,
      title
    }) => ({
      name: title,
      value: id
    }));

  inquirer.prompt([{
    type: 'list',
    name: 'role',
    message: "Select a new Role?",
    choices: roles,
    validate :(value) => {if(value) return true; else return `Please select  to continue` }
  }]).then(function(res){  //5})
      console.log('role:' + res.role);
      console.log('select employee:' + selectedEmp)
    dbConnection.query(`UPDATE employee SET role_id = ? WHERE id = ?`,[res.role, selectedEmp],(err, result) => {
        if (err) throw err;
        console.log("Employee Role Update");
        init();

  });
  });

          });
        });
    });
}
function getEmployeeManager()
{
//const managers4Role = ['None'];
dbConnection.query(`SELECT * FROM employee`, async (err, results) => {
    if (err) throw err;
    const managers = await results.map(({
        id,
        first_name,
      last_name
      
    }) => ({
      name: first_name + " " + last_name,
      value: id
    }));
 
    return managers;
        });
        
}
function viewDepartment()
{
    dbConnection.query("SELECT * FROM department",
    function (err, results) {
      if (err) throw err
      console.table(results)
      init();
    })
}
function viewRoles(){

    dbConnection.query('SELECT title  FROM roles',  function (err, results) {
        if (err) throw err
        console.table(results)
        init();
      
      });
}

function addRole()
{
    const department = [];
    dbConnection.query('SELECT *  FROM department', function (err, results) {
        //console.log(results);
         Object.keys(results).forEach(function(key) {
            var row = results[key];
            department.push(row.dept_name)
          });
         // console.log(roles)
        
      });
    inquirer.prompt([{
        type: 'input',
        name: 'roleName',
        message: "What is the name of the  Role?",
        validate :(value) => {if(value) return true; else return `Please enter role to continue` }
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the salary of the  Role?",
        validate :(value) => {if(value) return true; else return `Please enter salary to continue` }
      },
      {
        type: 'list',
        name: 'department',
        message: "Which department does the role belong to?",
        choices : department,
        validate :(value) => {if(value) return true; else return `Please enter  to continue` }
      }
    ]).then(function(res){
        dbConnection.query('INSERT INTO  roles SET title=?,salary=?,department_id=?' ,[res.roleName,res.salary,1] , function (err, results) {
            if (err) throw err
           
            init();
          
          });   
      })
}