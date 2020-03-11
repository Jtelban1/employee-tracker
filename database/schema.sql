CREATE DATABASE IF NOT EXISTS employee_tracker;

USE employee_tracker;

CREATE TABLE IF NOT EXISTS employee
(
	id int auto_increment,
	first_name VARCHAR(30) NULL,
	last_name VARCHAR(30),
	role_id INT,
	manager_id INT,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS role
(
	id INT auto_increment,
	title VARCHAR(30),
	salary DECIMAL (7,2),
	department_id INT,
	PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS department
(
	id INT auto_increment,
	name VARCHAR (30),
	PRIMARY KEY(id)
);