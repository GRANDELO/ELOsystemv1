const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const homeRoutes = require('../zote/testing/homeRoutes');
const nameRoutes = require('../zote/testing/nameRoutes');
const thankyouRoutes = require('../zote/testing/thankyouRoutes');
const moreThankyouRoutes = require('../zote/testing/moreThankyouRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

//routes
app.use('/', homeRoutes);
app.use('/', nameRoutes);
app.use('/', thankyouRoutes);
app.use('/', moreThankyouRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
