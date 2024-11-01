const paymentQueue = require('./queue');
const Order = require('./models/Order'); // Adjust the path as necessary
const { sendOrderReceiptEmail } = require('./emailService'); // Import your email service

paymentQueue.process(async (job) => {
    const { checkoutId } = job.data;

    try {
        const order = await Order.findOne({ CheckoutRequestID: checkoutId });
        if (!order) {
            console.error(`Mpesa Order not found for CheckoutRequestID: ${checkoutId}`);
            return;
        }

        order.paid = true;
        await order.save();
        
        sendOrderReceiptEmail(order.orderNumber);
        console.log(`Order paid successfully for CheckoutRequestID: ${checkoutId}`);
    } catch (error) {
        console.error('Failed to process payment:', error);
    }
});
