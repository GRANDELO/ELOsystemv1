// src/components/SystemSettings.js
import React, { useState } from 'react';

function SystemSettings() {
    const [settings, setSettings] = useState({
        securityLevel: 'Medium',
        enableNotifications: true,
    });

    const toggleNotifications = () => {
        setSettings({ ...settings, enableNotifications: !settings.enableNotifications });
    };

    return (
        <div className="system-settings">
            <h2>System Settings</h2>
            <div>
                <label>Security Level:</label>
                <select 
                    value={settings.securityLevel} 
                    onChange={(e) => setSettings({ ...settings, securityLevel: e.target.value })}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div>
                <label>
                    <input 
                        type="checkbox" 
                        checked={settings.enableNotifications} 
                        onChange={toggleNotifications}
                    />
                    Enable Notifications
                </label>
            </div>
        </div>
    );
}

export default SystemSettings;
