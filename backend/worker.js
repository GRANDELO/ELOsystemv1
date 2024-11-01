const PendingJob = require('./models/PendingJob');
const Order = require('./models/Order');
const {sendOrderReceiptEmail} = require('./controllers/orderController');
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

// Run the worker every 60 seconds to process jobs
setInterval(processPendingJobs, 60000);
