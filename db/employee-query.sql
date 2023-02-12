SELECT
  employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title AS title, 
  department.name AS department,
  role.salary AS salary,
   CONCAT(manager.manager_first_name, " " , manager.manager_last_name) as manager
FROM employee
LEFT JOIN (
    SELECT employee.id AS employee_id,
     employee.first_name AS employee_first_name,
     employee.last_name AS employee_last_name,
     manager.first_name AS manager_first_name,
     manager.last_name AS manager_last_name,
     manager.id AS manager_id
FROM employee
JOIN employee manager
  ON employee.manager_id = manager.id
) as manager on employee.id = manager.employee_id
INNER JOIN role on role.id = employee.role_id
INNER JOIN department on role.department_id = department.id;
