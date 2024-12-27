const Order = require('../models/Order');
const Employee = require('../models/Employee'); // Replace DeliveryPerson with Employee
const Product = require('../models/oProduct'); // Adjust this path as needed
const sendEmail = require('../services/emailService');
const User = require('../models/User');
const TransactionLedger = require('../models/TransactionLedger'); // Adjust the path as needed
const CompanyFinancials = require('../models/CompanyFinancials'); // Adjust path as necessary
const ProductPerformance = require('../models/ProductPerformance');
const {increateNotification} = require('./notificationController');
const {b2cRequestHandler} = require("./mpesaController");
const CoreSellOrder = require('../models/CoreSellOrder');
const { generateVerificationCode } = require('../services/verificationcode');
const { sersendNotification, sersendNotificationToUser} = require('./pushNotificationController');

// Create Order
exports.createOrder = async (req, res) => {
  const {
    items,
    totalPrice,
    paymentMethod,
    destination,
    orderDate,
    username,
    orderReference,
    sellerOrderId,
  } = req.body;

  try {
    // Validate required fields
    if (!items) {
      return res.status(400).json({ message: 'Missing required field: items' });
    }
    if (!totalPrice) {
      return res.status(400).json({ message: 'Missing required field: totalPrice' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Missing required field: paymentMethod' });
    }
    if (!destination) {
      return res.status(400).json({ message: 'Missing required field: destination' });
    }
    if (!orderDate) {
      return res.status(400).json({ message: 'Missing required field: orderDate' });
    }
    if (!username) {
      return res.status(400).json({ message: 'Missing required field: username' });
    }
    if (!orderReference) {
      return res.status(400).json({ message: 'Missing required field: orderReference' });
    }

    // Find an available delivery person with role "delivery" and status "available"
    const deliveryPerson = await Employee.findOne({ role: 'delivery', status: 'available' }).sort({ createdAt: 1 });
    const orderNumber = 'ORD' + generateVerificationCode(6);

    // Extract product IDs from items and find the respective product owners
    const productIds = items.map(item => item.productId); // Assuming each item contains a productId
    const products = await Product.find({ _id: { $in: productIds } }); // Fetch product details
    const productOwners = [...new Set(products.map(product => product.username))]; // Get unique usernames of owners

    // Create the order
    const orderData = {
      items,
      orderNumber,
      totalPrice,
      paymentMethod,
      paid: false,
      destination,
      orderDate,
      username,
      isDeliveryInProcess: false,
      isDelivered: false,
      packed: false,
      orderReference,
      ...(sellerOrderId && { sellerOrderId }), // Only add sellerOrderId if it exists
    };

    const order = new Order(orderData);
    await order.save();

    // Send notifications to product owners
    for (const owner of productOwners) {
      await sersendNotificationToUser(
        owner, 
        'New Order Alert', 
        `You have a new order for one of your products!`, 
        '', 
        `https://baze-link.web.app`, 
        `New Order notification`, 
        true
      );

      await increateNotification(
        owner,
        `You have a new order for one of your products!`,
        `New Order notification`,

      )
    }

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
    const deliveryPerson = await Employee.findOne({ workID: eid, role: 'delivery' });
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


exports.getMyPendingOrder = async (req, res) => {
  try {
    // Step 1: Fetch orders that are not packed
    const { username } = req.params;
    const orders = await Order.find({ currentplace: "Waiting for delivery." }).lean(); // Fetch all orders with the currentplace
    console.log('Fetched Orders:', orders.length); // Log the number of fetched orders

    if (orders.length === 0) {
      return res.json([]); // Return empty if no orders found
    }

    // Step 2: Extract product IDs from all orders
    const productIds = orders.flatMap(order =>
      order.items.map(item => item.productId)
    );

    // Step 3: Fetch product details that belong to the username
    const products = await Product.find({ _id: { $in: productIds }, username }).lean(); // Filter products by username

    // Step 4: Create a map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = { // Use product._id instead of productId
        name: product.name,
        category: product.category,
        image: product.images,
        price: product.price,
      };
    });

    // Step 5: Format the response with order details and filtered products
    const orderProductDetails = orders.map(order => {
      const formattedProducts = order.items
        .filter(item => productMap[item.productId]) // Only include products that match the username
        .map(item => ({
          ...productMap[item.productId], // Get the product details from the map
          quantity: item.quantity, // Include the quantity from the order
          variance: item.variations,
        }));

      return {
        orderId: order.orderNumber,
        products: formattedProducts,
      };
    }).filter(order => order.products.length > 0); // Exclude orders with no matching products
    console.log(orderProductDetails);
    res.json(orderProductDetails);
  } catch (error) {
    console.error('Failed to fetch unpacked order products:', error);
    res.status(500).json({ message: 'Failed to fetch unpacked order products', error: error.message });
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
    const { username } = req.params; 
    const orders = await Order.find({ currentplace: "Waiting for delivery." }).lean(); // Using .lean() for better performance
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
        image: product.images,
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

exports.getUnpa = async (req, res) => {
  const totalAmount = 80; // Sample total amount for the order
  const orderNumber = 'ORD070168'; // Sample order number

  // Sample products array with the new field structure
  const products = [
    {
      username: 'kinyi', // Seller's username
      price: 25,          // Price per unit
      quantity: 2         // Quantity of units
    },
    {
      username: '__tee__', // Another seller's username
      price: 10,           // Price per unit
      quantity: 3          // Quantity of units
    }
  ];

  try {
    // Await the result of TransactionLedgerfuc and send the success message as a response
    const result = await sendOrderReceiptEmail(orderNumber);
    res.status(200).json(result); // Send the success message to the client
  } catch (error) {
    // Capture any error and send an error response
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


exports.sendOrderReceiptEmail = async (orderNumber) => {
  try {
    // Fetch the order by order number
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) {
      throw new Error('Order not found');
    }

    const user = await User.findOne({ username: order.username }).lean();
    if (!user) {
      throw new Error('User not found');
    }

    // Extract product IDs and seller usernames from the order items
    const productIds = order.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = {
        productid: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        username: product.username, // Include seller info
        discount: product.discount,
        discountpersentage: product.discountpersentage,
      };
    });

    // Format products with details for email content
    const formattedProducts = order.items.map(item => ({
      ...productMap[item.productId],
      quantity: item.quantity,
    }));

    // Decrement stock for each product
    for (const item of order.items) {
      const product = products.find(p => p._id.toString() === item.productId.toString());
      if (product) {
        product.quantity -= item.quantity;
        const saleDate = new Date();
        await updateProductPerformance(product._id, product.name, product.username, saleDate);
        if (product.quantity < 0) product.quantity = 0;
        await product.save();
      }
    }
    

    // Prepare email content
    const subject = "Receipt for - " + order.orderNumber;
    const receiptMessage = `Dear ${user.username},

    Thank you for shopping with Bazelink! Here is the receipt for your recent purchase.
    
    Order Number: ${order.orderNumber}
    
    Products Ordered:
    ${formattedProducts
      .map(
        (product) =>
          `- ${product.name} (Category: ${product.category}) x${product.quantity} @ ${product.price} each`
      )
      .join('\n')}
    
    Feel free to leave a review on the product:
    ${formattedProducts
      .map(
        (product) =>
          `https://grandelo.web.app/review?productId=${productid}`
      )
      .join('\n')}
    
    Total Amount Paid: ${order.totalPrice}
    Payment Method: ${order.paymentMethod}
    
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
      <ul style="font-size: 16px; color: #555; list-style-type: none; padding: 0;">
        ${formattedProducts
          .map(
            (product) => `
          <li style="margin-bottom: 15px;">
            <strong>${product.name}</strong> (Category: ${product.category}) x${product.quantity} @ ${product.price} each
            <div style="text-align: center; margin-top: 10px;">
              <a href="https://baze-link.web.app/review?productId=${productid}" 
                 style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px;">
                Review this product
              </a>
            </div>
          </li>`
          )
          .join('')}
      </ul>
      <p style="font-size: 16px; color: #555; margin-top: 20px;">
        <strong>Total Amount Paid:</strong> ${order.totalPrice}<br>
        <strong>Payment Method:</strong> ${order.paymentMethod}<br>
      </p>
      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
        We hope to serve you again soon!
      </p>
      <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
        Best regards,<br> Bazelink Support Team
      </p>
    </div>
    `;

    await sendEmail(user.email, subject, receiptMessage, htmlReceiptMessage);
    console.log('Receipt email sent successfully');

    // Pass the formatted products array to the TransactionLedger function
    await notifyOutOfStockAndDelete();
    await TransactionLedgerfuc(formattedProducts, order.orderNumber);
    
  } catch (error) {
    console.error('Failed to send receipt email:', error);
  }
};

const sendOrderReceiptEmail = async (orderNumber) => {
  try {
    // Fetch the order by order number
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) {
      throw new Error('Order not found');
    }

    const user = await User.findOne({ username: order.username }).lean();
    if (!user) {
      throw new Error('User not found');
    }

    // Extract product IDs and seller usernames from the order items
    const productIds = order.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = {
        productid: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        username: product.username, // Include seller info
        discount: product.discount,
        discountpersentage: product.discountpersentage,
      };
    });

    // Format products with details for email content
    const formattedProducts = order.items.map(item => ({
      ...productMap[item.productId],
      quantity: item.quantity,
    }));

    // Decrement stock for each product
    for (const item of order.items) {
      const product = products.find(p => p._id.toString() === item.productId.toString());
      if (product) {
        product.quantity -= item.quantity;
        const saleDate = new Date();
        await updateProductPerformance(product._id, product.name, product.username, saleDate);
        if (product.quantity < 0) product.quantity = 0;
        await product.save();
      }
    }
    

    // Prepare email content
    const subject = "Receipt for - " + order.orderNumber;
    const receiptMessage = `Dear ${user.username},

    Thank you for shopping with Bazelink! Here is the receipt for your recent purchase.
    
    Order Number: ${order.orderNumber}
    
    Products Ordered:
    ${formattedProducts
      .map(
        (product) =>
          `- ${product.name} (Category: ${product.category}) x${product.quantity} @ ${product.price} each`
      )
      .join('\n')}
    
    Feel free to leave a review on the product:
    ${formattedProducts
      .map(
        (product) =>
          `https://baze-link.web.app/review?productId=${product.productid}`
      )
      .join('\n')}
    
    Total Amount Paid: ${order.totalPrice}
    Payment Method: ${order.paymentMethod}
    
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
      <ul style="font-size: 16px; color: #555; list-style-type: none; padding: 0;">
        ${formattedProducts
          .map(
            (product) => `
          <li style="margin-bottom: 15px;">
            <strong>${product.name}</strong> (Category: ${product.category}) x${product.quantity} @ ${product.price} each
            <div style="text-align: center; margin-top: 10px;">
              <a href="https://grandelo.web.app/review?productId=${product.productid}" 
                 style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #ffffff; background-color: #1d4ed8; text-decoration: none; border-radius: 6px;">
                Review this product
              </a>
            </div>
          </li>`
          )
          .join('')}
      </ul>
      <p style="font-size: 16px; color: #555; margin-top: 20px;">
        <strong>Total Amount Paid:</strong> ${order.totalPrice}<br>
        <strong>Payment Method:</strong> ${order.paymentMethod}<br>
      </p>
      <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
        We hope to serve you again soon!
      </p>
      <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
        Best regards,<br> Bazelink Support Team
      </p>
    </div>
    `;

    await sendEmail(user.email, subject, receiptMessage, htmlReceiptMessage);
    console.log('Receipt email sent successfully');

    // Pass the formatted products array to the TransactionLedger function
    await notifyOutOfStockAndDelete();
    await TransactionLedgerfuc(formattedProducts, order.orderNumber);
    
  } catch (error) {
    console.error('Failed to send receipt email:', error);
  }
};

const TransactionLedgerfuc = async (products, orderNumber) => {
  const order = await Order.findOne({ orderNumber });
  const sellerOrderId = order ? order.sellerOrderId : undefined;
  const coreseller = sellerOrderId ? await CoreSellOrder.findOne({ sellerOrderId }) : null;

  const defaultSellerPercentage = 0.8;
  const defaultCompanyPercentage = 0.2;
  const sellerPercentage = sellerOrderId ? 0.8 : defaultSellerPercentage;
  const coSellerPercentage = sellerOrderId ? 0.1 : 0;
  const companyPercentage = sellerOrderId ? 0.1 : defaultCompanyPercentage;

  const earningsData = {};

  for (const product of products) {
    const { username, price, quantity, discount, discountpersentage } = product;
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(discount);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(price);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(username);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(quantity);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(discountpersentage);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    // Check for discount and calculate the effective price
    const effectivePrice = discount
      ? price * (1 - (discountpersentage / 100)) // Apply percentage discount
      : price;
      
      console.log(effectivePrice);
    const sellerEarnings = effectivePrice * quantity * sellerPercentage;
    const coSellerEarnings = sellerOrderId ? effectivePrice * quantity * coSellerPercentage : 0;
    const companyEarnings = effectivePrice * quantity * companyPercentage;

    if (!earningsData[username]) {
      earningsData[username] = { sellerEarnings: 0, coSellerEarnings: 0, companyEarnings: 0 };
    }

    earningsData[username].sellerEarnings += sellerEarnings;
    earningsData[username].companyEarnings += companyEarnings;
    earningsData[username].coSellerEarnings += coSellerEarnings;
  }

  let totalCompanyEarnings = 0;

  for (const [username, data] of Object.entries(earningsData)) {
    const user = await User.findOne({ username });
    if (!user) {
      console.warn(`User ${username} not found, skipping`);
      continue;
    }

    const oldbal = user.amount || 0;
    const newbal = oldbal + (data.sellerEarnings || 0);
    user.amount = newbal;
    await user.save();

    totalCompanyEarnings += data.companyEarnings;

    if (coreseller) {
      const resp = await b2cRequestHandler(data.coSellerEarnings, coreseller.mpesaNumber);
      console.log(resp);
    }

    await TransactionLedger.create({
      orderId: orderNumber,
      seller: username,
      sellerEarnings: data.sellerEarnings,
      companyEarnings: data.companyEarnings,
      cosellerEarnings: data.coSellerEarnings || 0,
    });

    console.log(`Earnings recorded for ${username}`);
  }

  let financialRecord = await CompanyFinancials.findOne({});
  if (!financialRecord) {
    console.warn('Financial record not found, creating a new one.');
    financialRecord = new CompanyFinancials({ totalIncome: 0, netBalance: 0, transactions: [] });
    await financialRecord.save();
  }

  const updateResult = await CompanyFinancials.updateOne(
    { _id: financialRecord._id },
    {
      $push: {
        transactions: {
          transactionType: 'income',
          amount: totalCompanyEarnings,
          description: `Earnings from order ${orderNumber}`
        }
      },
      $inc: {
        totalIncome: totalCompanyEarnings,
        netBalance: totalCompanyEarnings
      },
      updatedAt: new Date()
    }
  );

  console.log('Update result for CompanyFinancials:', updateResult);
  const message = `Sales processed successfully for order ${orderNumber}. Total company earnings: $${totalCompanyEarnings.toFixed(2)}`;
  return { message };
};

const notifyOutOfStockAndDelete = async () => {
  try {
    // Fetch all products with zero or negative stock
    const outOfStockProducts = await Product.find({ quantity: { $lte: 0 } }).lean();

    if (outOfStockProducts.length === 0) {
      console.log('No out-of-stock products to process.');
      return;
    }
    

    for (const product of outOfStockProducts) {
      // Fetch the seller's details
      const seller = await User.findOne({ username: product.username }).lean();
      if (!seller) {
        console.warn(`Seller not found for product ${product.name} (ID: ${product._id})`);
        continue;
      }

      // Prepare and send email notification
      const subject = `Product Out of Stock - ${product.name}`;
      const message = `Dear ${seller.username},

Your product "${product.name}" is now out of stock and has been removed from the marketplace.

If you would like to restock, please update your inventory accordingly.

Best regards,
Bazelink Team`;

      const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 25px; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #1d4ed8; text-align: center; font-size: 26px; margin-bottom: 10px;">
          Product Out of Stock Notification
        </h2>
        <p style="font-size: 16px; color: #555;">
          Dear ${seller.username},<br>
          Your product <strong>${product.name}</strong> is now out of stock and has been removed from the marketplace.
        </p>
        <p style="font-size: 16px; color: #555;">
          If you would like to restock, please update your inventory accordingly.
        </p>
        <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
          Best regards,<br> Bazelink Team
        </p>
      </div>
      `;

      const notificationmessage = `Your product "${product.name}" is now out of stock and has been removed from the marketplace. If you would like to restock, please update your inventory accordingly.`;
      // Send email using the sendEmail function
      await sendEmail(seller.email, subject, message, htmlMessage);
      await increateNotification(seller.username, notificationmessage, subject);
      console.log(`Out-of-stock notification sent for product: ${product.name}`);

      // Delete the out-of-stock product
      await Product.findByIdAndDelete(product._id);
      console.log(`Deleted out-of-stock product: ${product.name}`);
    }
  } catch (error) {
    console.error('Failed to process out-of-stock products:', error);
  }
};

const updateProductPerformance = async (productId, productName, seller, saleDate) => {
  try {
    // Check if the product performance record exists
    let productRecord = await ProductPerformance.findOne({ productId });

    if (!productRecord) {
      // Create a new record if it doesn't exist
      productRecord = new ProductPerformance({
        productId,
        productName,
        seller,
        saleDates: [saleDate]
      });
      await productRecord.save();
      console.log(`New performance record created for product: ${productName} by seller: ${seller}`);
    } else {
      // Add the sale date to the existing record
      productRecord.saleDates.push(saleDate);
      await productRecord.save();
      console.log(`Sale date added to existing record for product: ${productName}`);
    }

    return { message: `Product performance updated for ${productName}`, data: productRecord };
  } catch (error) {
    console.error('Failed to update product performance:', error);
    return { error: 'Failed to update product performance' };
  }
};





