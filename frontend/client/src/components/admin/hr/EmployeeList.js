import React, { useEffect, useState } from 'react';
import { getEmployees } from '../services/employeeService';
import EmployeeCard from './EmployeeCard';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getEmployees().then((response) => setEmployees(response.data));
    }, []);

    return (
        <div className="employee-list">
            {employees.map((employee) => (
                <EmployeeCard key={employee._id} employee={employee} />
            ))}
        </div>
    );
};

export default EmployeeList;
