import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';


const Hr = () => {
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="hr">
            <h1>Employee Management System</h1>
            <EmployeeForm onSave={() => setRefresh(!refresh)} />
            <EmployeeList key={refresh} />
        </div>
    );
};

export default Hr;
