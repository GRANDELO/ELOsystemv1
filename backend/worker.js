const PendingJob = require('./models/PendingJob');
const Order = require('./models/Order');
const {sendOrderReceiptEmail} = require('./controllers/orderController');
const mongoose = require('mongoose');
const Box = require('./models/box'); // Box model
const User = require('./models/agents'); // User model with agent's info
const { v4: uuidv4 } = require('uuid');
const { generateVerificationCode } = require('./services/verificationcode');
const https = require('https');

const processPendingJobs = async () => {
    try {
        const unprocessedJobs = await PendingJob.find({ processed: false }); // Get unprocessed jobs
        for (let job of unprocessedJobs) {
            const { callbackData } = job;
            const resultCode = callbackData.ResultCode;
            const checkoutId = callbackData.CheckoutRequestID;


            if (resultCode === 0) {
                const amountpaid = callbackData.CallbackMetadata.Item.find(item => item.Name.trim() === "Amount").Value;
                const MpesaReceiptNumber = callbackData.CallbackMetadata.Item.find(item => item.Name.trim() === "MpesaReceiptNumber").Value;
                const PhoneNumber = callbackData.CallbackMetadata.Item.find(item => item.Name.trim() === "PhoneNumber").Value;
                const order = await Order.findOne({ CheckoutRequestID: checkoutId });
                if (order) {
                    if (order.totalPrice === amountpaid)
                    {
                      order.paid = true;
                      await sendOrderReceiptEmail(order.orderNumber, MpesaReceiptNumber, PhoneNumber);
                    }else
                    {
                      order.totalPrice -= amountpaid;
                    }

                    await order.save();



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
// Function to determine time slot
const getTimeSlot = (date) => {
  const hours = date.getHours();
  return hours >= 0 && hours < 12 ? 'midnight_to_noon' : 'noon_to_midnight';
};

// Function to group orders into boxes
const groupOrdersForAllAgents = async () => {
  try {
    // Step 1: Get all agents with valid agent numbers
    const agents = await User.find({ agentnumber: { $exists: true } });

    if (!agents || agents.length === 0) {
      console.log("No agents found.");
      return "No agents found.";
    }

    // Step 2: Process each agent
    for (const agent of agents) {
      const { agentnumber, packeges, townspecific } = agent;

      console.log(`Processing agent: ${agentnumber}`);

      // Step 3: Filter unpacked orders for the agent
      const unpackedOrders = packeges.filter((pkg) => !pkg.ispacked);

      if (unpackedOrders.length === 0) {
        console.log(`No unpacked orders found for agent: ${agentnumber}`);
        continue;
      }

      // Step 4: Process each unpacked order
      for (const pkg of unpackedOrders) {
        const { productId: orderId, processedDate } = pkg;

        // Fetch the corresponding order details
        const order = await Order.findOne({ "items.pOrderNumbe": orderId });
        if (!order) {
          console.warn(`Order not found: ${orderId}`);
          continue;
        }

        const { destination } = order;
        const timeSlot = getTimeSlot(processedDate); // Helper function to determine time slot
        const date = processedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Step 5: Check if a box exists for the agent, destination, date, and time slot
        let box = await Box.findOne({
          destination,
          packingDate: {
            $gte: new Date(`${date}T00:00:00Z`),
            $lt: new Date(`${date}T23:59:59Z`),
          },
          boxNumber: { $regex: `${timeSlot}_${agentnumber}` },
        });

        // Step 6: Create a new box if:
        // - No box exists, OR
        // - The existing box is already packed

        if (!box || box.packed) {
          box = new Box({
            boxNumber:  `${uuidv4()}_${timeSlot}_${agentnumber}`,
            boxid: generateVerificationCode(6),
            destination,
            items: [{ orderNumber: orderId }], // Add the current order
            agentnumber,
            currentplace: `${agent.locations.county}, ${agent.locations.town}, ${agent.locations.area}, ${agent.locations.specific}`,
            packingDate: new Date(),
            packed: false,
            deliveryPerson: "non assigned",
          });

          await box.save();
        } else {
          // Add the order to the existing box if it's not already added
          if (!box.items.some((item) => item.orderNumber === orderId)) {
            box.items.push({ orderNumber: orderId });
            await box.save();
          }
        }

        // Step 7: Update the order and mark it as packed
        order.packed = true;
        await order.save();

        // Step 8: Update the package in the agent's document
        pkg.ispacked = true;
        pkg.processedDate = new Date();
      }

      // Step 9: Save the updated agent document
      await agent.save();
      console.log(`Orders grouped successfully into boxes for agent: ${agentnumber}`);
    }

    return "Orders grouped successfully into boxes for all agents.";
  } catch (error) {
    console.error("Error grouping orders into boxes:", error);
    return "Error: Internal Server Error.";
  }
};

const keepServerActive = (url) => {
  const req = https.get(url, (res) => {
    console.log(`Pinged ${url} - Status: ${res.statusCode}`);
  });

  req.on('error', (err) => {
    console.error(`Error pinging ${url}:`, err.message);
  });
  req.end();
};

setInterval(() => keepServerActive('https://elosystemv1.onrender.com/api/locations'), 720000);
setInterval(groupOrdersForAllAgents, 60000);
setInterval(processPendingJobs, 60000);