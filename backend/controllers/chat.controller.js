const fs = require('fs');
const path = require('path');
const QAPair = require('../models/qa.model');
const Product = require('../models/oProduct');
const { getSession } = require('../sessionStore');

const companyInfoPath = path.join(__dirname, '../data/company_info.txt');

const greetingKeywords = ["hi", "niaje", "hello", "hey", "howdy", "sasa", "greetings", "oya"];
const greetingResponse = "Hello, Welcome to Bazelink. How can I assist you today?";

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};

const getEmbedding = async (text) => {
  return Array(768).fill(0.01 * text.length);
};

const readCompanyInfo = async () => {
  return fs.promises.readFile(companyInfoPath, 'utf-8');
};

exports.getChatResponse = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }
    
    const normalizedMessage = message.toLowerCase().trim();
    let session = getSession(sessionId);
    
    if (greetingKeywords.includes(normalizedMessage)) {
      return res.json({ response: greetingResponse, confidence: 1.0 });
    }
    
    if (session && session.productId) {
      const product = await Product.findById(session.productId);
      if (normalizedMessage.includes("price") && product) {
        return res.json({ response: `The price of ${product.name} is $${product.price}.`, confidence: 1.0 });
      }
      if ((normalizedMessage.includes("stock") || normalizedMessage.includes("remaining")) && product) {
        return res.json({ response: `There are ${product.stock} units of ${product.name} remaining.`, confidence: 1.0 });
      }
      if ((normalizedMessage.includes("details") || normalizedMessage.includes("description")) && product) {
        return res.json({ response: `Details for ${product.name}: ${product.description}`, confidence: 1.0 });
      }
    }
    
    const userEmbedding = await getEmbedding(message);
    const qaPairs = await QAPair.find({});
    let bestMatch = null;
    let bestScore = -1;
    
    for (const pair of qaPairs) {
      let pairEmbedding = pair.embedding || await getEmbedding(pair.question);
      const score = cosineSimilarity(userEmbedding, pairEmbedding);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pair;
      }
    }
    
    const CONFIDENCE_THRESHOLD = 0.7;
    if (bestScore >= CONFIDENCE_THRESHOLD) {
      return res.json({ response: bestMatch.answer, confidence: bestScore });
    }
    
    const companyInfo = await readCompanyInfo();
    const companyEmbedding = await getEmbedding(companyInfo);
    const companyScore = cosineSimilarity(userEmbedding, companyEmbedding);
    
    if (companyScore >= 0.6) {
      return res.json({ response: `Here's what I found: ${companyInfo}`, confidence: companyScore });
    }
    
    return res.json({ response: "I'm not quite sure I understood that. Could you please rephrase?", confidence: 0.0 });
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
    // Optionally, compute and store the embedding for the question.
    const embedding = await getEmbedding(question);
    const newQAPair = new QAPair({ question, answer, embedding });
    await newQAPair.save();
    return res.json({ message: 'Q&A pair added successfully', data: newQAPair });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
