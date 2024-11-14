import axios from 'axios';
import React, { useState } from 'react';

function EmployeeRegistration() {
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        eid: '',
        role: '',
        password: '',
        email: '', // Added email field
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setMessage('Invalid email format.');
            return;
        }

        if (!validatePassword(formData.password)) {
            setMessage('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/employees/register', formData);
            setMessage(`Success: ${response.data.message}`);
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Registration failed'}`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </label>
                <br />

                <label>
                    Surname:
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
                </label>
                <br />

                <label>
                    EID:
                    <input type="text" name="eid" value={formData.eid} onChange={handleChange} required />
                </label>
                <br />

                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <br />

                <label>
                    Role:
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="sales_manager">Sales Manager</option>
                        <option value="customer_support">Customer Support</option>
                        <option value="product/inventory_manager">Product/Inventory Manager</option>
                        <option value="delivery">Delivery</option>
                        <option value="logistics_manager">Logistics Manager</option>
                        <option value="marketing">Marketing</option>
                        <option value="finance_accounting">Finance/Accounting</option>
                        <option value="purchasing_manager">Purchasing Manager</option>
                        <option value="packager">Warehouse Staff</option>
                        <option value="it_support">IT Support</option>
                        <option value="hr">HR</option>
                        <option value="data_analyst">Data Analyst</option>
                        <option value="quality_assurance">Quality Assurance</option>
                    </select>
                </label>
                <br />

                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="At least 8 characters, including upper, lower, number, and special character"
                    />
                </label>
                <br />

                <button type="submit">Register Employee</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default EmployeeRegistration;
