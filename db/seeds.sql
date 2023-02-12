INSERT INTO department (id, name)
VALUES (001, "Sales"),
       (002, "Engineering"),
       (003, "Finance"),
       (004, "Legal");
       
INSERT INTO role (id, title, salary,department_id)
VALUES (001,"Sales Lead", 100000, 001),
       (002, "Salesperson", 80000, 001),
       (003, "Lead Engineer", 150000, 002),
       (004, "Software Engineer", 120000, 002),
       (005, "Account Manager", 160000, 003),
       (006, "Accountant", 125000, 003),
       (007, "Legal Team Lead", 250000, 004),
       (008, "Lawyer", 190000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001,"John", "Doe", 001, 001),
       (002, "Mike", "Chan", 002, null ),
       (003, "Ashley", "Redriguez", 003, 003),
       (004, "Kevin", "Tupik", 004, null ),
       (005, "Kunal", "Singh", 005, 005),
       (006, "Malia", "Brown", 006, null ),
       (007, "Sarah", "Lourd", 007, 007),
       (008, "Tom", "Allen", 008, null );
       