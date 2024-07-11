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

const mongoURI = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

