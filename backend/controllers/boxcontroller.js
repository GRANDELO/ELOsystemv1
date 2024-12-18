const mongoose = require('mongoose');
const Box = require('../models/box'); // Box model
const User = require('../models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');

const getBoxesForAgent = async (req, res) => {
  try {
    const { agentnumber } = req.params;

    // Validate input
    if (!agentnumber) {
      return res.status(400).json({ error: "Agent number is required." });
    }

    // Check if the agent exists in the database
    const agent = await User.findOne({ agentnumber });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    // Fetch all boxes for this agent with isDeliveryInProcess: false
    const boxes = await Box.find({
      agentnumber: agentnumber,
      isDeliveryInProcess: false,
    });

    if (boxes.length === 0) {
      return res.status(404).json({ message: "No boxes found for this agent." });
    }

    // Return the boxes
    return res.status(200).json({ message: "Boxes retrieved successfully.", boxes });
  } catch (error) {
    console.error("Error retrieving boxes for agent:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { getBoxesForAgent };
