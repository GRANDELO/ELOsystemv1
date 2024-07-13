require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/business';

mongoose.connect(mongoURI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:3001", "http://localhost:3000"],//if one port is in use already use the other one
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

