USE employee_db

INSERT INTO department (dept_name)
VALUES ('Engineering'),
('Finance'),
('Marketing'),
('Information Technology');

INSERT INTO roles(title,salary,department_id)
VALUES('Jr.Engineer',10000.00,1),
('Sr.Engineer',15000,1),
('Programmer Analyst',9000,1),
('Front-end Engineer',12000,4),
('Jr.Devleoper',9000,4),
('Sr.Developer',10000,4),
('FinancialManager', 12000, 2),
('Sr.Financial Analyst', 50000, 2),
('Jr.Financial Analyst', 90000, 2),
('Marketing Manager', 90000, 3),
('Jr.Market Specialist', 50000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
('Ananaya', 'Gopinath', 1, 1),
('Dhruva', 'Gopi', 1, 1),
('Sangeetha', 'Rao', 2, null),
('Antony', 'Das', 3, 2),
('Shakunthala', 'Devi', 4, 2);
