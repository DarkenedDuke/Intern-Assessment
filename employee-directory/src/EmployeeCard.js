import React from "react";

function EmployeeCard({ employee }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold">{employee.name}</h2>
      <p className="text-gray-600">{employee.position}</p>
      <p className="text-gray-500">{employee.department}</p>
      <span
        className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
          employee.status === "Active"
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        {employee.status}
      </span>
    </div>
  );
}

export default EmployeeCard;

