const Order = require('../models/Order');
const Employee = require('../models/Employee'); // Replace DeliveryPerson with Employee
const Product = require('../models/oProduct'); // Adjust this path as needed
const sendEmail = require('../services/emailService');
const User = require('../models/User');
const TransactionLedger = require('../models/TransactionLedger'); // Adjust the path as needed

// Create Order
exports.createOrder = async (req, res) => {
  const { items, totalPrice, paymentMethod, destination, orderDate, username, orderReference } = req.body;

  console.log();
  try {
    if (!items ) {
      return res.status(400).json({ message: 'Missing required fields '+  items +'ddddddddddd'});
    }
    if (!totalPrice) {
      return res.status(400).json({ message: 'Missing required fields' +totalPrice  +'ddddddddddd'});
    }
    if (!paymentMethod ) {
      return res.status(400).json({ message: 'Missing required fields' +paymentMethod +'ddddddddddd'});
    }
    if (!destination ) {
      return res.status(400).json({ message: 'Missing required fields' + destination+'ddddddddddd'});
    }
    if (!orderDate ) {
      return res.status(400).json({ message: 'Missing required fields' +orderDate +'ddddddddddd'});
    }
    if ( !username) {
      return res.status(400).json({ message: 'Missing required fields' +username +'ddddddddddd' });
    }
    if ( !orderReference) {
      return res.status(400).json({ message: 'Missing required fields' +orderReference +'ddddddddddd' });
    }
    

    // Find an available delivery person with role "delivery" and status "available"
    const deliveryPerson = await Employee.findOne({ role: 'delivery', status: 'available' }).sort({ createdAt: 1 });

    // Create the order
    const order = new Order({
      items,
      totalPrice,
      paymentMethod,
      paid: false,
      destination,
      orderDate,
      username,
      deliveryPerson: deliveryPerson ? deliveryPerson._id : null,
      isDeliveryInProcess: false,
      isDelivered: false,
      packed: false,
      orderReference
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

    const orders = await Order.find({ deliveryPerson: deliveryPerson._id, packed: true, isDelivered: false });
    
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.getMyOrder = async (req, res) => {
  const { username } = req.params; 

  try {


    const orders = await Order.find({ username: username });
    
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch my orders:', error);
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
    // Step 1: Fetch orders that are not packed
    const orders = await Order.find({ packed: false }).lean(); // Using .lean() for better performance
    console.log('Fetched Orders:', orders.length); // Log the number of fetched orders

    if (orders.length === 0) {
      return res.json([]); // Return empty if no orders found
    }

    // Step 2: Extract product IDs from all orders
    const productIds = orders.flatMap(order => 
      order.items.map(item => item.productId)
    );

    // Step 3: Fetch product details for all product IDs at once
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Step 4: Create a map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = { // Use product._id instead of productId
        name: product.name,
        category: product.category,
        image: product.image,
        price: product.price,
      };
    });

    // Step 5: Format the response with order details
    const orderProductDetails = orders.map(order => {
      const formattedProducts = order.items.map(item => ({
        ...productMap[item.productId], // Get the product details from the map
        quantity: item.quantity, // Include the quantity from the order
      }));

      return {
        orderId: order._id,
        products: formattedProducts,
      };
    });

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

exports.deliverypatcher = async (req, res) => {
  const { orderId } = req.params;

  try {
    const Orders = await Order.findOne({ orderNumber: orderId });
    if (!Orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    Orders.isDelivered = true;
    await Orders.save();

    res.status(200).json({ message: 'Orders Delivered.' });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};


exports.sendOrderReceiptEmail = async (orderNumber) => {
  try {
    // Step 1: Fetch the order by order number
    const order = await Order.findOne({ orderNumber }).lean();
    const user = await User.findOne({ username: order.username }).lean();
    
    if (!order) {
      throw new Error('Order not found');
    }
    if (!user) {
      throw new Error('user not found');
    }

    // Step 2: Extract product IDs from the order
    const productIds = order.items.map(item => item.productId);

    // Step 3: Fetch product details for all product IDs
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Step 4: Create a map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = {
        name: product.name,
        category: product.category,
        price: product.price,
      };
    });

    // Step 5: Format products and order details for email content
    const formattedProducts = order.items.map(item => ({
      ...productMap[item.productId],
      quantity: item.quantity,
    }));

    const subject = "Receipt for - " + order.orderNumber;
    
    const receiptMessage = `Dear ${user.username},

Thank you for shopping with Bazelink! Here is the receipt for your recent purchase.

Order Number: ${order.orderNumber}

Products Ordered:
${formattedProducts.map(product => `- ${product.name} (Category: ${product.category}) x${product.quantity} @ ${product.price} each`).join('\n')}

Total Amount Paid: ${order.totalPrice}
Payment Method: ${order.paymentMethod}
User: ${user.username}

We hope to serve you again soon!

Best regards,
Bazelink`;

    const htmlReceiptMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
          Order Receipt - Bazelink
        </h2>
        <p style="font-size: 16px; color: #555;">
          Dear ${user.username},<br>
          Thank you for your purchase! Here are the details for your order.
        </p>
        <p style="font-size: 16px; color: #555;">
          <strong>Order Number:</strong> ${order.orderNumber}<br>
        </p>
        <h3 style="color: #1d4ed8; margin-top: 20px;">Products Ordered:</h3>
        <ul style="font-size: 16px; color: #555;">
          ${formattedProducts.map(product => `
            <li>
              ${product.name} (Category: ${product.category}) x${product.quantity} @ ${product.price} each
            </li>
          `).join('')}
        </ul>
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          <strong>Total Amount Paid:</strong> ${order.totalPrice}<br>
          <strong>Payment Method:</strong> ${order.paymentMethod}<br>
          <strong>User:</strong> ${user.username}
        </p>
        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
          We hope to serve you again soon!
        </p>
        <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
          Best regards,<br> Bazelink Support Team
        </p>
      </div>
    `;

    try {
      await sendEmail(user.email, subject, receiptMessage, htmlReceiptMessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    const ledger = TransactionLedgerfuc(order.totalPrice, order.username,  order.orderNumber);
    
    console.log(ledger);
    console.log('Receipt email sent successfully');
  } catch (error) {
    console.error('Failed to send receipt email:', error);
  }
};

const TransactionLedgerfuc = async (totalAmount, seller, orderNumber ) => {
  
  const user = await User.findOne({ username: seller }).lean();

  if (!user) {
    throw new Error('user not found');
  }

  // Define the percentage split
  const sellerPercentage = 0.8; // 80% for the seller
  const companyPercentage = 0.2; // 20% for the company

  // Calculate earnings
  const sellerEarnings = totalAmount * sellerPercentage;
  const companyEarnings = totalAmount * companyPercentage;

  // Record transaction in ledger
  await TransactionLedger.create({
    orderId: orderNumber,
    seller,
    sellerEarnings,
    companyEarnings
  });

  const oldbal = user.amount;
  const newbal = oldbal + sellerEarnings;
  user.amount = newbal;
  await user.save();

  return {
    message: `Sales done for seller ${seller}. Your earnings: $${sellerEarnings.toFixed(2)}. Company earnings: $${companyEarnings.toFixed(2)}. Data stored successfully.`,
    sellerEarnings,
    companyEarnings
  };
};



