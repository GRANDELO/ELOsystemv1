const { CoreSellOrder } = require('../models/CoreSellOrder');
const { Product } = require('../models/oProduct');
const crypto = require('crypto');

exports.createCoreSellOrder = async (req, res) => {
  try {
    const { mpesaNumber, username, productId } = req.body;

    // Validate inputs
    if (!mpesaNumber || !username || !productId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Debug request body data
    console.log('Received data:', req.body);

    // Check if the product exists
    const product = await Product.findById(productId);
    console.log('Product found:', product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a unique order ID
    const sellerOrderId = crypto.randomUUID();

    // Save the order to the database
    const newOrder = new CoreSellOrder({
      mpesaNumber,
      username,
      productId,
      sellerOrderId,
    });

    await newOrder.save();

    // Respond with the order details
    res.status(201).json({
      message: 'Core sell order created successfully',
      sellerOrderId,
    });

  } catch (error) {
    console.error('Failed to create core sell order:', error);
    res.status(500).json({ message: 'Failed to create core sell order' });
  }
};
