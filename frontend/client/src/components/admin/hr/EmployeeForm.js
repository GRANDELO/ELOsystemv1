import axios from 'axios';
import React, { useState } from 'react';

function EmployeeForm({ refreshEmployees }) {
    const [form, setForm] = useState({ firstName: '', surname: '', role: '', eid: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://elosystemv1.onrender.com/api/employees', form)
            .then(() => {
                setForm({ firstName: '', surname: '', role: '', eid: '', password: '' });
                refreshEmployees();
            })
            .catch(error => console.error('Error creating employee:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
            <input type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" required />
            <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
            <input type="text" name="eid" value={form.eid} onChange={handleChange} placeholder="Employee ID" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit">Add Employee</button>
        </form>
    );
}

export default EmployeeForm;
