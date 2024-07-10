const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sayhi = require('./testdata');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to Grandelo');
});

app.get('/name', (req, res) => {
  res.send(sayhi(x));
});

app.post('/thankyou', (req, res) => {
  const { name } = req.body;
  if (name) {
    res.json({ message: `Thank you, ${name}. It a great pleasue having you in this app.` });
  } else {
    res.status(400).json({ message: 'Name is required' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
