const express = require('express');
const cors = require('cors');
require('dotenv').config();

const homeRoutes = require('./routes/homeRoutes');
const nameRoutes = require('./routes/nameRoutes');
const thankyouRoutes = require('./routes/thankyouRoutes');
const moreThankyouRoutes = require('./routes/moreThankyouRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Use the routes
app.use('/', homeRoutes);
app.use('/', nameRoutes);
app.use('/', thankyouRoutes);
app.use('/', moreThankyouRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
