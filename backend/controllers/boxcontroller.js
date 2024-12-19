const mongoose = require('mongoose');
const Box = require('../models/box'); // Box model
const User = require('../models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');

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


const addBoxToAgentPackages = async (req, res) => {
  try {
    const { agentnumber, boxId } = req.body;

    // Validate inputs
    if (!agentnumber || !boxId) {
      return res.status(400).json({ error: "Agent number and Box ID are required." });
    }

    // Find the box by boxId
    const box = await Box.findOne({ boxid: boxId });
    if (!box) {
      return res.status(404).json({ error: "Box not found." });
    }

    // Check if the box is empty
    const bitems = box.items || [];
    if (bitems.length === 0) {
      return res.status(400).json({ error: "Box is empty." });
    }

    // Find the agent by agentnumber
    const agent = await User.findOne({ agentnumber });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    const addedOrders = [];
    const skippedOrders = [];

    for (const order of bitems) {
      // Check if the order already exists in the packages array

      const theorder = await Order.findOne({ orderNumber: order.orderNumber });
      
      const orderExists = agent.packeges.some(
        (package) => package.productId === order.orderNumber
      );

      if (orderExists) {
        skippedOrders.push(order.orderNumber); // Track skipped orders
        continue;
      }

      // Add the new order to the packages array
      agent.packeges.push({
        productId: order.orderNumber,
        processedDate: new Date(),
        ispacked: false,
      });
      addedOrders.push(order.orderNumber); // Track successfully added orders

      theorder.currentplace =  agent.town + ' ' + agent.townspecific;
      theorder.packed = true;
      await theorder.save();
    }

    // Save the updated agent document
    await agent.save();

    return res.status(200).json({
      message: "Orders processed successfully.",
      addedOrders,
      skippedOrders,
      agent,
    });
  } catch (error) {
    console.error("Error adding order to agent packages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { 
  getBoxesForAgent,
  addBoxToAgentPackages
};
