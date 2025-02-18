// controllers/chat.controller.js
const QAPair = require('../models/qa.model');
const { getSession, setSession } = require('../sessionStore');
const Product = require('../models/oProduct');

// Predefined greetings and their response
const greetingKeywords = ["hi", "niaje", "hello", "hey", "howdy", "sasa","greetings", 'oya'];
const greetingResponse = "Hello, Welcome to Bazelink. How can I assist you today?";

// Utility for text matching in Q&A pairs
const findClosestMatch = (query, qaPairs) => {
  query = query.toLowerCase();
  return qaPairs.find(pair => query.includes(pair.question.toLowerCase()));
};

exports.getChatResponse = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }
    
    const normalizedMessage = message.toLowerCase().trim();
    let session = getSession(sessionId);
    
    // First, check if the message is a greeting.
    if (greetingKeywords.includes(normalizedMessage)) {
      return res.json({ response: greetingResponse });
    }
    
    // Check if this is a follow-up question based on previous product context.
    if (session && session.productId) {
      // Look for follow-up keywords
      if (normalizedMessage.includes("price")) {
        const product = await Product.findById(session.productId);
        if (product && product.price) {
          return res.json({ response: `The price of ${product.name} is $${product.price}.` });
        }
      }
      
      if (normalizedMessage.includes("stock") || normalizedMessage.includes("remaining")) {
        const product = await Product.findById(session.productId);
        if (product && product.stock != null) {
          return res.json({ response: `There are ${product.stock} units of ${product.name} remaining.` });
        }
      }
      
      // You can add additional follow-up keywords like "details", "features", etc.
      if (normalizedMessage.includes("details") || normalizedMessage.includes("description")) {
        const product = await Product.findById(session.productId);
        if (product) {
          return res.json({ response: `Here are the details for ${product.name}: ${product.description}` });
        }
      }
    }
    
    // If not a follow-up, check if the message might be related to a product.
    // Here we assume product name matching.
    const product = await Product.findOne({ name: { $regex: new RegExp(message, 'i') } });
    if (product) {
      // Save product context in session
      setSession(sessionId, { productId: product._id, productName: product.name });
      return res.json({ response: `You asked about ${product.name}. ${product.description}` });
    }
    
    // If not a product query, then search through the Q&A pairs.
    const qaPairs = await QAPair.find({});
    const match = findClosestMatch(message, qaPairs);
    if (match) {
      return res.json({ response: match.answer });
    }
    
    // Fallback response if nothing matches.
    return res.json({ response: "I'm sorry, I don't have an answer for that yet." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.addQAPair = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    const newQAPair = new QAPair({ question, answer });
    await newQAPair.save();
    return res.json({ message: 'Q&A pair added successfully', data: newQAPair });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
