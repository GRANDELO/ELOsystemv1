const QAPair = require('../models/qa.model');
const Product = require('../models/oProduct');

// Predefined greetings and their response
const greetingKeywords = ["hi", "hello", "hey", "howdy", "greetings"];
const greetingResponse = "Hello, Welcome to Bazelink. How can I assist you today?";

// Simple utility for text matching in Q&A pairs
const findClosestMatch = (query, qaPairs) => {
  query = query.toLowerCase();
  return qaPairs.find(pair => query.includes(pair.question.toLowerCase()));
};

exports.getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    
    const normalizedMessage = message.toLowerCase().trim();
    
    // First, check if the message is a greeting.
    // This ensures that greetings are handled before any product matching logic.
    if (greetingKeywords.includes(normalizedMessage)) {
      return res.json({ response: greetingResponse });
    }
    
    // Next, check if the message might be related to a product.
    // This regex search is case-insensitive.
    const product = await Product.findOne({ name: { $regex: new RegExp(message, 'i') } });
    if (product) {
      return res.json({ response: product.description });
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
