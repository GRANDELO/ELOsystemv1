const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { upload, gfs } = require('./services/gridFsConfig');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Middleware to add upload and gfs to req
app.use((req, res, next) => {
  req.upload = upload;
  req.gfs = gfs;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: 'GET,POST,PUT,DELETE',
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
