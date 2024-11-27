import React, { useState, useEffect } from 'react';

const LogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/logs', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch logs');
        }

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Audit Logs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
};

export default LogsViewer;
