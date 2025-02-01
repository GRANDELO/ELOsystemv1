const mongoose = require('mongoose');
const Box = require('../models/box'); // Box model
const User = require('../models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const Dpe = require('../models/DeliveryPersonnel');

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

    // Find the delivery person by deliveryPersonnumber
    const delperson = await Dpe.findOne({ deliveryPersonnumber: box.deliveryPerson });
    if (!delperson) {
      return res.status(404).json({ error: "Delivery person not found." });
    }

    // Check if the box exists in the delivery person's packages
    const boxIndex = delperson.packeges.findIndex(
      (package) => package.boxid === boxId
    );
    if (boxIndex !== -1) {
      // Update the isdelivered status to true for this package
      delperson.packeges[boxIndex].isdelivered = true;
      await delperson.save();

    }

    // Check if the box contains items
    const bitems = box.items || [];
    if (bitems.length === 0) {
      return res.status(400).json({ error: "Box is empty." });
    }

    // Find the agent by agentnumber
    const agent = await User.findOne({ agentnumber });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    // Initialize arrays to track processed orders
    const addedOrders = [];
    const skippedOrders = [];

    // Iterate through the items in the box
    for (const order of bitems) {
      const orderRecord = await Order.findOne({ orderNumber: order.orderNumber });
      if (!orderRecord) {
        skippedOrders.push(order.orderNumber); // Skip if the order doesn't exist
        continue;
      }

      // Check if the order already exists in the agent's packages
      const orderExists = agent.packeges.some(
        (package) => package.productId === order.orderNumber
      );

      if (orderExists) {
        skippedOrders.push(order.orderNumber); // Skip if already added
        continue;
      }else{
        const oldbal = agent.amount || 0;
        const newbal = oldbal + 20;
        agent.amount = newbal;
      }

      // Add the order to the agent's packages
      agent.packeges.push({
        productId: order.orderNumber,
        processedDate: new Date(),
        ispacked: false,
      });
      addedOrders.push(order.orderNumber); // Track added orders

      // Update the order's properties
      orderRecord.currentplace = `${agent.locations.county}, ${agent.locations.town}, ${agent.locations.area}, ${agent.locations.specific}`;
      orderRecord.packed = true;
      await orderRecord.save(); // Save the updated order
    }

    // Save the updated agent document
    await agent.save();

    return res.status(200).json({
      message: "Orders processed successfully.",
      addedOrders, // Successfully added orders
      skippedOrders, // Orders that were skipped
      agent,
    });
  } catch (error) {
    console.error("Error adding orders to agent packages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { 
  getBoxesForAgent,
  addBoxToAgentPackages
};
