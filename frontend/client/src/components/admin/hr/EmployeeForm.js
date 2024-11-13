// src/components/CreateEmployee.js
import React, { useState } from 'react';
import { addEmployee } from '../service/employeeService';

const CreateEmployee = () => {
  const [employeeData, setEmployeeData] = useState({ firstName: '', surname: '', password: '', eid: '', role: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addEmployee(employeeData);
      setSuccess('Employee created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="surname" placeholder="Surname" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="eid" placeholder="EID" onChange={handleChange} required />
        <input type="text" name="role" placeholder="Role" onChange={handleChange} required />
        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
};

export default CreateEmployee;
