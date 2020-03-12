INSERT INTO department (name) 
VALUES ("HR"), ("Finance"), ("Accounting");


INSERT INTO role (title, salary, department_id) 
VALUES ("Manager", 120, 1), ("Supervisor", 80, 2), ("Intern", 45, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("John", "Doe", 1, 3), ("Swae", "Lee", 2, 1), ("Lisa", "Win", 3, 2);
