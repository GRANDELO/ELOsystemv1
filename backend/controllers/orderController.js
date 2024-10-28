const Order = require('../models/Order');
const Employee = require('../models/Employee'); // Replace DeliveryPerson with Employee

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
      isDelivered: false
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
exports.getOrders = async (req, res) => {
  try {
    // Populate deliveryPerson with their name and other fields if needed
    const orders = await Order.find().populate('deliveryPerson', 'firstName surname');
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).send(error);
  }
};
