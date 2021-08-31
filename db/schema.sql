DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
  
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(6,2),
  department_id INT,
  FOREIGN KEY(department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
  );
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) ,
  last_name VARCHAR(30) ,
  role_id INT ,
  manager_id INT NULL ,
  PRIMARY KEY (id)
);