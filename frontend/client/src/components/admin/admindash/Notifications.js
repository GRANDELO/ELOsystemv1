// src/components/Notifications.js
import React, { useState } from 'react';

function Notifications() {
    const [notifications] = useState([
        { id: 1, message: 'New user registered: John Smith' },
        { id: 2, message: 'System upgrade scheduled for 2024-11-15' }
    ]);

    return (
        <div className="notifications">
            <h2>Notifications</h2>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;
