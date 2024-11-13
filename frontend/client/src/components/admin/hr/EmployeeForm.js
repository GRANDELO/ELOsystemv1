import React, { useState } from 'react';
import { addEmployee, updateEmployee } from '../services/employeeService';

const EmployeeForm = ({ existingEmployee, onSave }) => {
    const [employee, setEmployee] = useState(existingEmployee || { firstName: '', surname: '', role: '', eid: '' });

    const handleChange = (e) => setEmployee({ ...employee, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        existingEmployee ? await updateEmployee(employee._id, employee) : await addEmployee(employee);
        onSave();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="firstName" value={employee.firstName} onChange={handleChange} placeholder="First Name" />
            <input name="surname" value={employee.surname} onChange={handleChange} placeholder="Surname" />
            <input name="role" value={employee.role} onChange={handleChange} placeholder="Role" />
            <input name="eid" value={employee.eid} onChange={handleChange} placeholder="EID" />
            <button type="submit">Save</button>
        </form>
    );
};

export default EmployeeForm;
