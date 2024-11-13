import axios from 'axios';
import React, { useEffect, useState } from 'react';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get('https://elosystemv1.onrender.com/api/employees')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    return (
        <div>
            <h2>Employee List</h2>
            <ul>
                {employees.map(employee => (
                    <li key={employee._id}>{employee.firstName} {employee.surname} - {employee.role}</li>
                ))}
            </ul>
        </div>
    );
}

export default EmployeeList;
