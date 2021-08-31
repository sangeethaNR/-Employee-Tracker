const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
require('dotenv').config();

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
init();

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
                    ViewRoles();
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

    db.query("SELECT * FROM employee",
    function (err, results) {
      if (err) throw err
      console.table(results)
      init();
    })
};

