import React, { useState, useEffect } from "react";
import EmployeeCard from "./EmployeeCard";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    position: "",
    status: "Active"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees whenever filters change
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:5000/employees";

    const params = [];
    if (filterDept !== "All") params.push(`department=${filterDept}`);
    if (filterStatus !== "All") params.push(`status=${filterStatus}`);
    if (params.length > 0) {
      url = `http://localhost:5000/employees/filter?${params.join("&")}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load employees");
        setLoading(false);
      });
  }, [filterDept, filterStatus]);

  // Apply search filter locally
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add new employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee)
    })
      .then(res => res.json())
      .then(data => {
        setEmployees(prev => [...prev, data]);
        setNewEmployee({ name: "", department: "", position: "", status: "Active" });
      })
      .catch(err => console.error("Error adding employee:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee Directory</h1>

      {/* Add Employee Form */}
      <form onSubmit={handleAddEmployee} className="mb-6 p-4 border rounded bg-white">
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Department"
          value={newEmployee.department}
          onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={newEmployee.position}
          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <select
          value={newEmployee.status}
          onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </form>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search employees..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option>All</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Loading & Error */}
      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Employee Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} />
          )) 
        ) : (
          <p className="text-gray-500">No employees found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
