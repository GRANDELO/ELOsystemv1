const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const { username } = req.body; // Get username from request params

    if (!username) {
      return res.status(400).json({ message: "username required" });
    }

    // Find the cart by username
    try {
      const cart = await Cart.findOne({ user: username }).populate('items.Product');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "failed to populate." });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Return the cart data
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { username, productId, quantity } = req.body; // Get username from the request body
    let cart = await Cart.findOne({ user: username });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        user: username,
        items: [{ product: productId, quantity }],
      });
    }
    await cart.save();
    res.status(201).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { username, productId } = req.body; // Get username from the request body
    const cart = await Cart.findOne({ user: username });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { username } = req.body; // Get username from the request body
    const cart = await Cart.findOne({ user: username });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
