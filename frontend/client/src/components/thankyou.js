import React, { useState } from 'react';
import './styles/ThankYou.css';

function ThankYou() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [name3, setName3] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendRequest = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch('https://elosystemv1.onrender.com/morethankyou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name1, name2, name3 }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while sending the request.');
    }
  };

  return (
    <div className="container">
      <h1>Thank You API</h1>
      <input
        type="text"
        placeholder="Enter first name"
        value={name1}
        onChange={(e) => setName1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter second name"
        value={name2}
        onChange={(e) => setName2(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter third name"
        value={name3}
        onChange={(e) => setName3(e.target.value)}
      />
      <button onClick={sendRequest}>Submit</button>
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default ThankYou;
