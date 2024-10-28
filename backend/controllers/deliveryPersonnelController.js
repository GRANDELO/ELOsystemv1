const DeliveryPersonnel = require('../models/DeliveryPersonnel');

// Register Delivery Personnel
exports.registerDeliveryPersonnel = async (req, res) => {
  try {
    const newPersonnel = new DeliveryPersonnel(req.body);
    await newPersonnel.save();
    res.status(201).send(newPersonnel);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Fetch All Delivery Personnel
exports.getDeliveryPersonnel = async (req, res) => {
  try {
    const personnel = await DeliveryPersonnel.find();
    res.send(personnel);
  } catch (error) {
    res.status(500).send(error);
  }
};
