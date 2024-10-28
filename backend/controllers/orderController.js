const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPersonnel');

// Create Order
exports.createOrder = async (req, res) => {
  const { items, totalPrice, paymentMethod, destination, orderDate, username } = req.body;

  try {
    if (!items || !totalPrice || !paymentMethod || !destination || !orderDate || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find an available delivery person
    const deliveryPerson = await DeliveryPerson.findOne({ status: 'available' }).sort({ createdAt: 1 });

    const order = new Order({
      items,
      totalPrice,
      paymentMethod,
      destination,
      orderDate,
      username,
      deliveryPerson: deliveryPerson ? deliveryPerson._id : null,
      isDeliveryInProcess: false,
      isDelivered: false
    });

    await order.save();

    if (deliveryPerson) {
      deliveryPerson.status = 'assigned';
      await deliveryPerson.save();
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
};

// Assign Order to Delivery Personnel
exports.assignOrder = async (req, res) => {
  const { orderId, deliveryPersonnelId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryPerson = deliveryPersonnelId;  // Ensure this field name matches your Order model
    await order.save();

    res.json({ message: 'Order assigned successfully', order });
  } catch (error) {
    console.error('Failed to assign order:', error);
    res.status(500).send(error);
  }
};

// Fetch All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('deliveryPerson', 'name'); // Ensure field name matches your Order model
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).send(error);
  }
};
