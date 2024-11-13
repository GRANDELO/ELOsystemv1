import React from 'react';

const EmployeeCard = ({ employee }) => {
    return (
        <div className="employee-card">
            <h3>{employee.firstName} {employee.surname}</h3>
            <p>Role: {employee.role}</p>
            <p>Availability: {employee.availabilityStatus}</p>
        </div>
    );
};

export default EmployeeCard;
