const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;
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

module.exports = app;
