const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5000;

app.use(express.json());

const dataPath = path.join(__dirname, "employees.json");

// Helper to read/write JSON
function readEmployees() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}
function writeEmployees(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET all employees
app.get("/employees", (req, res) => {
  res.json(readEmployees());
});

// GET employee by ID
app.get("/employees/:id", (req, res) => {
  const employees = readEmployees();
  const emp = employees.find(e => e.id === parseInt(req.params.id));
  emp ? res.json(emp) : res.status(404).json({ error: "Not found" });
});

// Filter employees
app.get("/employees/filter", (req, res) => {
  let employees = readEmployees();
  const { department, status } = req.query;
  if (department) employees = employees.filter(e => e.department === department);
  if (status) employees = employees.filter(e => e.status === status);
  res.json(employees);
});

// POST new employee
app.post("/employees", (req, res) => {
  const employees = readEmployees();
  const newEmp = { id: employees.length + 1, ...req.body };
  employees.push(newEmp);
  writeEmployees(employees);
  res.json(newEmp);
});

// PUT update employee
app.put("/employees/:id", (req, res) => {
  const employees = readEmployees();
  const index = employees.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  employees[index] = { ...employees[index], ...req.body };
  writeEmployees(employees);
  res.json(employees[index]);
});

// DELETE employee
app.delete("/employees/:id", (req, res) => {
  let employees = readEmployees();
  const index = employees.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  const deleted = employees.splice(index, 1)[0];
  writeEmployees(employees);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
