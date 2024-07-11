import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function WebSocketComponent() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (msg) => {
      console.log('Message received:', msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Business Management</h1>
    </div>
  );
}

export default WebSocketComponent;
