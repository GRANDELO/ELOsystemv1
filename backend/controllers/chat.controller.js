const fs = require('fs');
const QAPair = require('../models/qa.model');
const Product = require('../models/oProduct');
const { getSession, setSession } = require('../sessionStore');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};
const getEmbedding = async (text) => {
  return Array(768).fill(0.01 * text.length);
};
const loadCompanyInfo = () => {
  try {
    return fs.readFileSync('company_info.txt', 'utf8');
  } catch (error) {
    console.error("Error loading company info:", error);
    return "";
  }
};
const companyInfo = loadCompanyInfo();
exports.getChatResponse = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }
    const normalizedMessage = message.toLowerCase().trim();
    let session = getSession(sessionId);
    if (session && session.productId) {
      const product = await Product.findById(session.productId);
      if (product) {
        if (normalizedMessage.includes("price")) {
          return res.json({ response: `The price of ${product.name} is $${product.price}.`, confidence: 1.0 });
        }
        if (normalizedMessage.includes("stock")) {
          return res.json({ response: `There are ${product.stock} units of ${product.name} remaining.`, confidence: 1.0 });
        }
        if (normalizedMessage.includes("details")) {
          return res.json({ response: `Details for ${product.name}: ${product.description}`, confidence: 1.0 });
        }
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
    if (bestScore >= 0.7) {
      return res.json({ response: bestMatch.answer, confidence: bestScore });
    }
    const sentences = companyInfo.split('.');
    let bestSentence = "I couldn't find an exact answer. Can you rephrase?";
    let bestSentenceScore = 0;
    sentences.forEach(sentence => {
      const sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
      const inputTokens = tokenizer.tokenize(normalizedMessage);
      const intersection = sentenceTokens.filter(word => inputTokens.includes(word));
      const score = intersection.length / inputTokens.length;
      if (score > bestSentenceScore) {
        bestSentenceScore = score;
        bestSentence = sentence;
      }
    });
    return res.json({ response: bestSentence, confidence: bestSentenceScore });
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
