// Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../components/styles/Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey Kinyi, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageToSend = input;
    // Add the user message immediately
    setMessages(prev => [...prev, { sender: 'user', text: messageToSend }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://elosystemv1.onrender.com/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });
      const data = await response.json();
      // Simulate a slight delay for a natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error: Something went wrong." }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chat with us</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="chat-message bot typing">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          Chat
        </button>
      )}
    </div>
  );
};

export default Chatbot;
