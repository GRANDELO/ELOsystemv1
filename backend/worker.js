const PendingJob = require('./models/PendingJob');
const Order = require('./models/Order');
const {sendOrderReceiptEmail} = require('./controllers/orderController');
const mongoose = require('mongoose');
const Box = require('./models/box'); // Box model
const User = require('./models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');

const processPendingJobs = async () => {
    try {
        const unprocessedJobs = await PendingJob.find({ processed: false }); // Get unprocessed jobs
        for (let job of unprocessedJobs) {
            const { callbackData } = job;
            const resultCode = callbackData.ResultCode;
            const checkoutId = callbackData.CheckoutRequestID;

            if (resultCode === 0) {
                const order = await Order.findOne({ CheckoutRequestID: checkoutId });
                if (order) {
                    order.paid = true;
                    await order.save();

                    await sendOrderReceiptEmail(order.orderNumber);

                    console.log(`Processed job for order ${checkoutId}`);
                } else {
                    console.error(`Order not found for CheckoutRequestID: ${checkoutId}`);
                }
            }

            job.processed = true; // Mark job as processed
            await job.save();
        }
    } catch (error) {
        console.error("Error processing pending jobs:", error);
    }
};

// Function to determine time slot
const getTimeSlot = (date) => {
  const hours = date.getHours();
  return hours >= 0 && hours < 12 ? 'midnight_to_noon' : 'noon_to_midnight';
};

// Function to group orders into boxes
const groupOrdersForAllAgents = async () => {
    try {
      // Step 1: Get all agents from the database
      const agents = await User.find({ agentnumber: { $exists: true } });
  
      if (!agents || agents.length === 0) {
        console.log("No agents found.");
        return "No agents found.";
      }
  
      // Step 2: Iterate through each agent and group their orders
      for (const agent of agents) {
        const agentnumber = agent.agentnumber;
  
        console.log(`Processing agent: ${agentnumber}`);
  
        // Step 3: Extract the products (unpacked orders) under this agent
        const unpackedOrders = agent.packeges.filter((pkg) => !pkg.ispacked);
  
        if (unpackedOrders.length === 0) {
          console.log(`No unpacked orders found for agent: ${agentnumber}`);
          continue; // Skip to the next agent if no unpacked orders
        }
  
        for (const pkg of unpackedOrders) {
          const orderId = pkg.productId;
          const processedDate = pkg.processedDate;
          // Fetch full order details from the database
          const order = await mongoose.model("Order").findById(orderId);
  
          if (!order) {
            console.warn(`Order not found: ${orderId}`);
            continue; // Skip if the order does not exist
          }
  
          const destination = order.destination;
          const timeSlot = getTimeSlot(processedDate);
          const date = processedDate.toISOString().split("T")[0]; // YYYY-MM-DD
  
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
              agentnumber: agentnumber,
              currentplace: "Warehouse",
              packingDate: new Date(),
              packed: false,
              deliveryPerson: 'non assigned', // Assign to the agent
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
        console.log(`Orders grouped successfully into boxes for agent: ${agentnumber}`);
      }
  
      return "Orders grouped successfully into boxes for all agents.";
    } catch (error) {
      console.error("Error grouping orders into boxes:", error);
      return "Error: Internal Server Error.";
    }
  };
  
setInterval(groupOrdersForAllAgents, 30000);
setInterval(processPendingJobs, 60000);