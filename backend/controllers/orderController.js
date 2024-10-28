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
exports.getOrder = async (req, res) => {
  const { eid } = req.params; // Assuming eid is passed as a URL parameter

  try {
    // Find the delivery person by EID
    const deliveryPerson = await Employee.findOne({ eid, role: 'delivery' });
    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    // Find orders assigned to this delivery person
    const orders = await Order.find({ deliveryPerson: deliveryPerson._id }).populate('deliveryPerson', 'firstName surname');
    
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

