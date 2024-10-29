const Order = require('../models/Order');
const Employee = require('../models/Employee'); // Replace DeliveryPerson with Employee
const Product = require('../models/oProduct'); // Adjust this path as needed

// Create Order
exports.createOrder = async (req, res) => {
  const { items, totalPrice, paymentMethod, destination, orderDate, username } = req.body;

  try {
    if (!items || !totalPrice || !paymentMethod || !destination || !orderDate || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find an available delivery person with role "delivery" and status "available"
    const deliveryPerson = await Employee.findOne({ role: 'delivery', status: 'available' }).sort({ createdAt: 1 });

    // Create the order
    const order = new Order({
      items,
      totalPrice,
      paymentMethod,
      destination,
      orderDate,
      username,
      deliveryPerson: deliveryPerson ? deliveryPerson._id : null,
      isDeliveryInProcess: false,
      isDelivered: false,
      packed: false 
    });

    await order.save();

    // Update delivery person status to "assigned" if found
    /*
    if (deliveryPerson) {
      deliveryPerson.status = 'assigned';
      await deliveryPerson.save();
    }*/

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
};

// Fetch All Orders with Populated Delivery Person Info
exports.getOrder = async (req, res) => {
  const { eid } = req.params; 

  try {
    const deliveryPerson = await Employee.findOne({ eid, role: 'delivery' });
    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    const orders = await Order.find({ deliveryPerson: deliveryPerson._id, packed: false, isDelivered: false });
    
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Get order ID from request parameters
  const { isDeliveryInProcess } = req.body; // Status update from request body

  try {
    // Find the order by ID and update the isDeliveryInProcess status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isDeliveryInProcess },
      { new: true }
    );

    // If order not found, return 404 error
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};


exports.getUnpackedOrderProducts = async (req, res) => {
  try {
    // Step 1: Fetch orders that are not packed and not delivered
    const orders = await Order.find({ packed: false, isDelivered: false });

    // Step 2: Prepare response with orderId and product details
    const orderProductDetails = await Promise.all(
      orders.map(async (order) => {
        const products = await Product.find({ _id: { $in: order.items } });
        return {
          orderId: order._id,
          products,
        };
      })
    );

    res.json(orderProductDetails);
  } catch (error) {
    console.error('Failed to fetch unpacked order products:', error);
    res.status(500).json({ message: 'Failed to fetch unpacked order products', error: error.message });
  }
};


exports.markOrderAsPacked = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find and update the order to set packed to true
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { packed: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order marked as packed successfully', order: updatedOrder });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

