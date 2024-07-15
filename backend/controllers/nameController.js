const sayhi = require('../testdata');

const sendName = (req, res) => {
  res.send(sayhi());
};

module.exports = {
  sendName
};
