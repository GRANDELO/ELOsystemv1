// controllers/chatController.js
const { pipeline } = require('@xenova/transformers');
const SpellChecker = require('simple-spellchecker');
const QAPair = require('../models/qa.model');
const Product = require('../models/product.model');
const { getSession, setSession } = require('../sessionStore');

// Initialize the embedding model
let extractor;
(async () => {
  extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
})();

// Load the dictionary for spell checking
let dictionary;
SpellChecker.getDictionary('en-US', (err, dict) => {
  if (!err) {
    dictionary = dict;
  }
});

// Function to correct spelling in a sentence
const correctSpelling = (sentence) => {
  if (!dictionary) {
    return sentence; // If dictionary isn't loaded, return the original sentence
  }
  return sentence.split(' ').map(word => {
    if (dictionary.spellCheck(word)) {
      return word; // Word is correct
    } else {
      const suggestions = dictionary.getSuggestions(word);
      return suggestions.length > 0 ? suggestions[0] : word; // Replace with the first suggestion
    }
  }).join(' ');
};

// Compute cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};

// Function to get embeddings for a given text
const getEmbedding = async (text) => {
  if (!extractor) {
    throw new Error('Extractor not initialized');
  }
  const result = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
};

// Chat response handler
exports.getChatResponse = async (req, res) => {
  try {
    let { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Correct spelling in the user message
    message = correctSpelling(message);

    const normalizedMessage = message.toLowerCase().trim();
    let session = getSession(sessionId);

    // Predefined greetings and their response
    const greetingKeywords = ["hi", "niaje", "hello", "hey", "howdy", "sasa", "greetings", 'oya'];
    const greetingResponse = "Hello, Welcome to Bazelink. How can I assist you today?";

    // Check for greetings first
    if (greetingKeywords.includes(normalizedMessage)) {
      return res.json({ response: greetingResponse, confidence: 1.0 });
    }

    // Check if this is a follow-up question based on previous product context
    if (session && session.productId) {
      const product = await Product.findById(session.productId);
      if (product) {
        setSession(sessionId, { productId: product._id, productName: product.name });
        if (normalizedMessage.includes('price')) {
          return res.json({ response: `The price of ${product.name} is $${product.price}.`, confidence: 1.0 });
        }
        if (normalizedMessage.includes('stock') || normalizedMessage.includes('remaining')) {
          return res.json({ response: `There are ${product.quantity} units of ${product.name} remaining.`, confidence: 1.0 });
        }
        if (normalizedMessage.includes('details') || normalizedMessage.includes('description')) {
          return res.json({ response: `Details for ${product.name}: ${product.description}`, confidence: 1.0 });
        }
      }
    }

    // Advanced matching for Q&A pairs using embeddings
    const userEmbedding = await getEmbedding(message);
    const qaPairs = await QAPair.find({});
    let bestMatch = null;
    let bestScore = -1;

    for (const pair of qaPairs) {
      let pairEmbedding = pair.embedding;
      if (!pairEmbedding || pairEmbedding.length === 0) {
        pairEmbedding = await getEmbedding(pair.question);
        pair.embedding = pairEmbedding;
        await pair.save();
      }
      const score = cosineSimilarity(userEmbedding, pairEmbedding);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pair;
      }
    }

    const CONFIDENCE_THRESHOLD = 0.7;
    if (bestScore < CONFIDENCE_THRESHOLD) {
      return res.json({ response: "I'm not quite sure I understood that. Could you please rephrase?", confidence: bestScore });
    }

    return res.json({ response: bestMatch.answer, confidence: bestScore });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
