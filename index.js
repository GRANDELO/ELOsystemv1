const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to Grandelo API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
