// src/components/Login.js
import axios from 'axios';
import React, { useState } from 'react';

function Login() {
    const [formData, setFormData] = useState({
        eid: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/employees/login', formData);
            setMessage(`Login successful! Welcome, ${response.data.name}`);
            // Store the token, if needed, in localStorage or context

            sessionStorage.setItem('firstName', response.data.name);
            sessionStorage.setItem('role', response.data.role);
            sessionStorage.setItem('eid', response.data.eid);
            sessionStorage.setItem('admintoken', response.data.token);
            localStorage.setItem('admintoken', response.data.token);
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Login failed'}`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    EID:
                    <input type="text" name="eid" value={formData.eid} onChange={handleChange} required />
                </label>
                <br />

                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
                <br />

                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
