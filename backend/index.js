const app = require('./server');
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
