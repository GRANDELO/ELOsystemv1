// src/components/EmployeeCard.js
import React from 'react';
import { FaCheckCircle, FaEdit, FaTimesCircle, FaTrashAlt } from 'react-icons/fa';

const EmployeeCard = ({ employee, onEdit, onDeactivate }) => {
  return (
    <div className="employee-card">
      <div className="employee-card-header">
        <h3 className="employee-name">{employee.firstName} {employee.surname}</h3>
        <p className="employee-role">{employee.role}</p>
      </div>
      <div className="employee-card-body">
        <div className="employee-status">
          {employee.availabilityStatus === 'available' ? (
            <span className="status-icon available"><FaCheckCircle /> Available</span>
          ) : (
            <span className="status-icon unavailable"><FaTimesCircle /> Unavailable</span>
          )}
        </div>
        <p className="employee-eid">EID: {employee.eid}</p>
      </div>
      <div className="employee-card-footer">
        <button className="edit-btn" onClick={() => onEdit(employee)}><FaEdit /> Edit</button>
        <button className="deactivate-btn" onClick={() => onDeactivate(employee._id)}><FaTrashAlt /> Deactivate</button>
      </div>
    </div>
  );
};

export default EmployeeCard;
