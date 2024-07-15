const thankyouMessage = (req, res) => {
    const { name } = req.body;
    if (name) {
      res.json({ message: `Thank you, ${name}. It a great pleasure having you in this app.` });
    } else {
      res.status(400).json({ message: 'Name is required' });
    }
  };
  
  module.exports = {
    thankyouMessage
  };
  