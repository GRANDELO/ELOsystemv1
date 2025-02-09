const express = require('express');
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io'); // Import socket.io
const app = express(); // Create an Express application

const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Attach socket.io to the server
module.exports = { io };
