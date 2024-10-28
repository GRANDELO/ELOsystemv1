// src/components/EmployeeRegistration.js
import axios from 'axios';
import React, { useState } from 'react';

function EmployeeRegistration() {
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        eid: '',
        role: '', // Default value
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/employees/register', formData );
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
                    Role:
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="admin">Admin</option>
                        <option value="sales_manager">Sales Manager</option>
                        <option value="customer_support">Customer Support</option>
                        <option value="product_manager">Product Manager</option>
                        <option value="inventory_manager">Inventory Manager</option>
                        <option value="warehouse_staff">Warehouse Staff</option>
                        <option value="delivery">Delivery</option>
                        <option value="logistics_manager">Logistics Manager</option>
                        <option value="marketing">Marketing</option>
                        <option value="content_creator">Content Creator</option>
                        <option value="seo_specialist">SEO Specialist</option>
                        <option value="finance_accounting">Finance/Accounting</option>
                        <option value="purchasing_manager">Purchasing Manager</option>
                        <option value="packager">Packager</option>
                        <option value="it_support">IT Support</option>
                        <option value="hr">HR</option>
                        <option value="data_analyst">Data Analyst</option>
                        <option value="quality_assurance">Quality Assurance</option>
                    </select>
                </label>
                <br />

                <button type="submit">Register Employee</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default EmployeeRegistration;
