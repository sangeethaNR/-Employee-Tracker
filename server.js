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
                    addRoles();
                    break;
                
                case 'View All Departments':
                    viewDepartment();
                    break;
                case    'Add Departments':
                    addDepartments();
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

//add Employee function

function addEmployee(){
    

//     Object.keys(results).forEach(function(key) {
//         var row = results[key];
//         roles.push(row.title)

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
            choices:roles,
            validate :(value) => {if(value) return true; else return `Please select role to continue` }
           },
           {
            type: 'list',
            message: "Who  is the employee's Manager?",
            name: 'empManager', 
            choices :managers,
            validate :(value) => {if(value) return true; else return `Please select   to continue` }
          }]).then(function(res){
            var sql = "INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";  
            var value = [res.empFirstName,res.empLastName,res.empRole,1];
           
            dbConnection.query(sql, [value], function (err, result) {  
            if (err) throw err;  
            console.log("Number of records inserted: " + result.affectedRows);  
            });  
          

         
       })

    
})
  //})
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
