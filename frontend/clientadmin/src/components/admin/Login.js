import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        eid: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [recoverPassword, setRecoverPassword] = useState(false); // Toggle between login and recover password views
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (recoverPassword) {
            await handleRecoverPassword(e);
            return;
        }
        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/employees/login', formData);
            setMessage(`Login successful! Welcome, ${response.data.name}`);
            sessionStorage.setItem('firstName', response.data.name);
            sessionStorage.setItem('role', response.data.role);
            sessionStorage.setItem('eid', response.data.workID);
            sessionStorage.setItem('admintoken', response.data.token);
            localStorage.setItem('admintoken', response.data.token);

            const role = response.data.role.trim().toLowerCase();
            if (role === 'admin') {
                navigate('/dashboard');
            } else if (role === 'sales_manager') {
                navigate('/sales');
            } else if (role === 'delivery') {
                navigate('/logistics');
            } else if (role === 'hr') {
                navigate('/hr');
            } else if (role === 'packager') {
                navigate('/packingpage');
            } else {
                setMessage(`Login successful! Welcome, ${response.data.name}, but no page is assigned. Contact HR for more info.`);
            }
        } catch (error) {
            setMessage(`Error: ${error.response?.data.message || 'Login failed'}`);
        }
    };

    const handleRecoverPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/employees/recoverpassword', { username: formData.eid });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data.message || 'An error occurred while processing your request.');
        }
    };

    const toggleRecoverPassword = () => {
        setRecoverPassword(!recoverPassword);
        setMessage(''); // Clear any messages when toggling views
    };

    return (
        <div className="log-container">
            <h2 className="log-heading">{recoverPassword ? 'Recover Password' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                {!recoverPassword ? (
                    <>
                        <label className="log-label">
                            Work ID:
                            <input
                                type="text"
                                name="eid"
                                value={formData.eid}
                                onChange={handleChange}
                                className="log-input"
                                required
                            />
                        </label>
                        <br />

                        <label className="log-label">
                            Password:
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="log-input"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="log-show-password-btn"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </label>
                        <br />

                        <button type="submit" className="log-button">Login</button>
                        <button type="button" onClick={toggleRecoverPassword} className="log-secondary-button">Forgot Password?</button>
                    </>
                ) : (
                    <>
                        <label className="log-label">
                            Enter your Work ID:
                            <input
                                type="text"
                                name="eid"
                                value={formData.eid}
                                onChange={handleChange}
                                className="log-input"
                                required
                            />
                        </label>
                        <br />
                        <button type="submit" className="log-button">Send Recovery Email</button>
                        <button type="button" onClick={toggleRecoverPassword} className="log-secondary-button">Back to Login</button>
                    </>
                )}
            </form>
            {message && (
                <p className={`log-message ${message.includes('Error') ? 'log-message--error' : 'log-message--success'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default Login;
