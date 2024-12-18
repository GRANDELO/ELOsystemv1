const PendingJob = require('./models/PendingJob');
const Order = require('./models/Order');
const {sendOrderReceiptEmail} = require('./controllers/orderController');
const mongoose = require('mongoose');
const Box = require('./models/box'); // Box model
const User = require('./models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');
const { generateVerificationCode } = require('./services/verificationcode');

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
      // Step 1: Get all agents
      const agents = await User.find({ agentnumber: { $exists: true } });
  
      if (!agents || agents.length === 0) {
        console.log("No agents found.");
        return "No agents found.";
      }
  
      // Step 2: Iterate through each agent and group their orders
      for (const agent of agents) {
        const agentnumber = agent.agentnumber;
  
        console.log(`Processing agent: ${agentnumber}`);
  
        // Extract unpacked orders for this agent
        const unpackedOrders = agent.packeges.filter((pkg) => !pkg.ispacked);
  
        if (unpackedOrders.length === 0) {
          console.log(`No unpacked orders found for agent: ${agentnumber}`);
          continue;
        }
  
        for (const pkg of unpackedOrders) {
          const orderId = pkg.productId;
          const processedDate = pkg.processedDate;
  
          // Fetch the order details
          const order = await mongoose.model("Order").findById(orderId);
          if (!order) {
            console.warn(`Order not found: ${orderId}`);
            continue;
          }
  
          const destination = order.destination;
          const timeSlot = getTimeSlot(processedDate); // Helper function to determine the time slot
          const date = processedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  
          // Check if a box already exists for this destination, date, and time slot
          let box = await Box.findOne({
            destination,
            packingDate: {
              $gte: new Date(`${date}T00:00:00Z`),
              $lt: new Date(`${date}T23:59:59Z`),
            },
            boxNumber: { $regex: timeSlot },
          });
  
          const orderNumber = order.orderNumber;
  
          if (!box) {
            // Create a new box if none exists
            box = new Box({
              boxNumber: `${uuidv4()}_${timeSlot}`,
              boxid: generateVerificationCode(6),
              destination,
              items: [{ orderNumber }], // Add the current order
              agentnumber,
              currentplace: "Warehouse",
              packingDate: new Date(),
              packed: false,
              deliveryPerson: "non assigned",
            });
  
            await box.save();
          } else {
            // Add the order to the existing box if not already added
            if (!box.items.some((item) => item.orderNumber === orderNumber)) {
              box.items.push({ orderNumber });
              await box.save();
            }
          }
  
          // Mark the package as packed
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