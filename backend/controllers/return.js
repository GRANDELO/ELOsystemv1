const ReturnRequest = require('../models/return');
const Agent = require('../models/agents');
const Order = require('../models/Order');
const sendEmailReturn = require('../services/emailBac');

const createReturn = async (req, res) =>{
    try{
        const { orderNumber, reason, condition, resolution, comments } = req.body;

        if (!orderNumber || !reason || !condition || !resolution) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const order = await Order.findOne({ orderNumber });
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }

        const { orderDate, username, destination } = order;

        const deliveryDate = orderDate;
        const currentDate = new Date();

        const timeDifference = currentDate - new Date(deliveryDate);
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference > 3 ){

          const expiredMessage =`
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
            <h2 style="color: #D32F2F;">Return Period Expired</h2>
            <p>Dear <strong>${username}</strong>,</p>
            <p>We regret to inform you that the return period for your order <strong>${orderNumber}</strong> has expired.</p>
            <p style="color: #555;">Returns are only accepted within <strong>2 days</strong> of delivery.</p>
            <p>If you have any concerns, please contact our support team.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #777; font-size: 12px;">Thank you for your understanding.</p>
          </div>
          `;
          await sendEmailReturn(order.email, "Return request Expired", expiredMessage);
          return res.status(400).json({ error: "Return period elapsed. You cannot submit a return request"});
          
        }

        const agent = await Agent.findOne({"locations.county": destination.county, "locations.town": destination.town})
          if (!agent) {
            return res.status(404).json({ error: "No agent found for the order's destination" });
          }

        const newReturn = new ReturnRequest({
            orderNumber,
            reason,
            condition,
            resolution,
            comments,
            customerNumber: order.username,
            agentNumber: agent.agentnumber,
          });

          await newReturn.save();

          const confirmationMessage = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
           <h2 style="color: #2E7D32;">Return Request Submitted</h2>
           <p>Dear <strong>${username}</strong>,</p>
           <p>Your return request for order <strong>${orderNumber}</strong> has been successfully submitted.</p>
           <p style="color: #555;">Our team will review your request and get back to you shortly.</p>
           <p>For any inquiries, feel free to contact our support team.</p>
           <hr style="border: none; border-top: 1px solid #ddd;">
           <p style="color: #777; font-size: 12px;">Thank you for shopping with us!</p>
          </div>
          `;
           await sendEmailReturn(order.email, "return request Submitted", confirmationMessage);
          res.status(200).json({ message: "return request succesful", data: newReturn});
    }catch (error){
        res.status(500).json({message: "request Failed"});
    }
}

const getAllReturns = async(req, res) => {
    try{
        const returns = await ReturnRequest.find().sort({createdAt: -1});

        res.status(200).json({returns})
    }catch (error){
        res.status(500).json({ error: "Failed to fetch return requests." });
    }
}

const getReturnById = async (req, res) => {
    try {
      const returnRequest = await ReturnRequest.findById(req.params.id);
      if (!returnRequest) return res.status(404).json({ error: "Return request not found." });
      res.status(200).json(returnRequest);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch return request." });
    }
  };

  const updateReturnStatus = async (req, res) => {
    try {
      const { returnId, status } = req.body;  // Status will be either 'Completed' or 'Cancelled'
  
      // Find return request
      const returnRequest = await ReturnRequest.findById(returnId);
      if (!returnRequest) {
        return res.status(404).json({ message: "Return request not found" });
      }
  
      // Fetch order details
      const order = await Order.findOne({ orderNumber: returnRequest.orderNumber });
      if (!order) {
        return res.status(404).json({ message: "Order not found for this return request" });
      }
  
      // Update the return request status
      returnRequest.status = status;
      await returnRequest.save();
  
      // If return is cancelled, send an email to notify the customer
      if (status === "Cancelled") {
        const emailMessage = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
            <h2 style="color: #D32F2F;">Return Request Cancelled</h2>
            <p>Dear <strong>${order.username}</strong>,</p>
            <p>We regret to inform you that your return request for order <strong>${returnRequest.orderNumber}</strong> has been cancelled.</p>
            <p style="color: #555;">Our team has reviewed your request and found that it does not meet the return policy.</p>
            <p>If you have any concerns, please contact our support team.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #777; font-size: 12px;">Thank you for shopping with us.</p>
          </div>
        `;
  
        await sendEmailReturn(order.email, "Return Request Cancelled", emailMessage);
      }
  
      res.status(200).json({ message: `Return request marked as ${status}`, returnRequest });
    } catch (error) {
      res.status(500).json({ message: "Error updating return request status", error: error.message });
    }
  };

exports.module = {
    createReturn,
    getAllReturns,
    getReturnById,
    updateReturnStatus,
  }