// AdminQA.jsx
import React, { useState } from 'react';
import '../components/styles/AdminQA.css';

const AdminQA = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://elosystemv1.onrender.com/api/chatbot/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Q&A pair added successfully.");
        setQuestion('');
        setAnswer('');
      } else {
        setMessage(data.error || "Error adding Q&A pair.");
      }
    } catch (err) {
      setMessage("Error adding Q&A pair.");
    }
  };

  return (
    <div className="admin-qa">
      <h2>Admin Q&A Panel</h2>
      {message && <p className="status-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Answer:</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Q&A Pair</button>
      </form>
    </div>
  );
};

export default AdminQA;
