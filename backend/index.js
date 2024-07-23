const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboard');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dash', dashboardRoutes);
app.use('/api/img', uploadRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

io.on('connection', (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
