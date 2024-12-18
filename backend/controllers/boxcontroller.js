const mongoose = require('mongoose');
const Box = require('../models/Box'); // Box model
const User = require('../models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');

// Function to determine time slot
const getTimeSlot = (date) => {
  const hours = date.getHours();
  return hours >= 0 && hours < 12 ? 'midnight_to_noon' : 'noon_to_midnight';
};

// Function to group orders into boxes
const groupOrdersIntoBoxes = async (req, res) => {
  try {
    const { agentnumber } = req.body;

    // Validate agentnumber
    if (!agentnumber) {
      return res.status(400).json({ error: "Agent number is required." });
    }

    // Step 1: Find agent by agentnumber
    const agent = await User.findOne({ agentnumber });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    // Step 2: Extract the products (unpacked orders) under this agent
    const unpackedOrders = agent.packeges.filter((pkg) => !pkg.ispacked);

    if (unpackedOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No unpacked orders found under this agent." });
    }

    // Step 3: Group orders into boxes
    for (const pkg of unpackedOrders) {
      const orderId = pkg.productId;

      // Fetch full order details from the database
      const order = await mongoose.model('Order').findById(orderId);

      if (!order) {
        console.warn(`Order not found: ${orderId}`);
        continue; // Skip if the order does not exist
      }

      const destination = order.destination;
      const timeSlot = getTimeSlot(order.createdAt);
      const date = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD

      // Check for an existing box for this destination, date, and time slot
      let box = await Box.findOne({
        destination,
        packingDate: {
          $gte: new Date(`${date}T00:00:00Z`),
          $lt: new Date(`${date}T23:59:59Z`),
        },
        boxNumber: { $regex: timeSlot }, // Match the correct time slot
      });

      // Step 4: Create a new box if none exists
      if (!box) {
        box = new Box({
          boxNumber: `${uuidv4()}_${timeSlot}`,
          destination,
          items: [{ orderId }],
          currentplace: "Warehouse",
          packingDate: new Date(),
          packed: false,
          deliveryPerson: agentnumber, // Assign to the agent
        });

        await box.save();
      } else {
        // Add the order to the existing box
        if (!box.items.some((item) => item.orderId.toString() === orderId)) {
          box.items.push({ orderId });
          await box.save();
        }
      }

      // Step 5: Mark the package as packed in the agent's packages
      pkg.ispacked = true;
      pkg.processedDate = new Date();
    }

    // Save the updated agent document
    await agent.save();

    return res
      .status(200)
      .json({ message: "Orders grouped successfully into boxes." });
  } catch (error) {
    console.error("Error grouping orders into boxes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { groupOrdersIntoBoxes };
