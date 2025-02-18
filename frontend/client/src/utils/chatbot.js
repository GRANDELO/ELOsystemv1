import React, { useState } from 'react';
import '../components/styles/Chatbot.css';

const Chatbot = () => {
  // Initial message from the bot greeting you!
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey Kinyi, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle sending messages
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    // Add user message to the conversation
    setMessages(prev => [...prev, userMessage]);

    // Simulate a bot response (you can later replace this with an API call)
    const botResponse = { sender: 'bot', text: 'Hmm, let me think...' };
    setMessages(prev => [...prev, botResponse]);
    
    // Clear input field
    setInput('');
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            Chat with us
            <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
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
      )}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          Chat
        </button>
      )}
    </div>
  );
};

export default Chatbot;
