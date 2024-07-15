const moreThankyouMessage = (req, res) => {
    const { name1, name2, name3 } = req.body;
    if (name1 && name2 && name3) {
      res.json({ message: `Thank you, ${name1}, ${name2}, and ${name3}` });
    } else {
      res.status(400).json({ message: 'All three names are required' });
    }
  };
  
  module.exports = {
    moreThankyouMessage
  };
  