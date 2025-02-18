const QAPair = require('../models/qa.model');
const Product = require('../models/oProduct');
const { getSession, setSession } = require('../sessionStore');


// Predefined greetings and their response
const greetingKeywords = ["hi", "niaje", "hello", "hey", "howdy", "sasa","greetings", 'oya'];
const greetingResponse = "Hello, Welcome to Bazelink. How can I assist you today?";

// Compute cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};

// Placeholder for an async function that returns an embedding for a given text.
// In practice, this could call a microservice built in Python using Sentence Transformers.
const getEmbedding = async (text) => {
  // For demo purposes, return a dummy vector (replace with real embeddings)
  // Example: return await callEmbeddingAPI(text);
  return Array(768).fill(0.01 * text.length); // Dummy vector; DO NOT use in production.
};

exports.getChatResponse = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }
    
    const normalizedMessage = message.toLowerCase().trim();
    let session = getSession(sessionId);
    
    // Check for greetings first.
    if (greetingKeywords.includes(normalizedMessage)) {
      return res.json({ response: greetingResponse, confidence: 1.0 });
    }
    
    // Check if this is a follow-up question based on previous product context.
    if (session && session.productId) {
      if (normalizedMessage.includes("price")) {
        const product = await Product.findById(session.productId);
        if (product && product.price) {
          return res.json({ response: `The price of ${product.name} is $${product.price}.`, confidence: 1.0 });
        }
      }
      
      if (normalizedMessage.includes("stock") || normalizedMessage.includes("remaining")) {
        const product = await Product.findById(session.productId);
        if (product && product.stock != null) {
          return res.json({ response: `There are ${product.stock} units of ${product.name} remaining.`, confidence: 1.0 });
        }
      }
      
      if (normalizedMessage.includes("details") || normalizedMessage.includes("description")) {
        const product = await Product.findById(session.productId);
        if (product) {
          return res.json({ response: `Details for ${product.name}: ${product.description}`, confidence: 1.0 });
        }
      }
    }
    
    // Advanced matching for Q&A pairs using embeddings.
    // First, compute the embedding for the user's message.
    const userEmbedding = await getEmbedding(message);
    
    const qaPairs = await QAPair.find({});
    let bestMatch = null;
    let bestScore = -1;
    
    // Iterate through each Q&A pair, assuming each pair has a precomputed embedding.
    // In a real-world scenario, you might precompute these and store them in your database.
    for (const pair of qaPairs) {
      // If the pair doesn't have an embedding, compute it on the fly (or precompute and store it).
      let pairEmbedding = pair.embedding;
      if (!pairEmbedding || pairEmbedding.length === 0) {
        pairEmbedding = await getEmbedding(pair.question);
        // Optionally, save this embedding back to the database for future use.
        pair.embedding = pairEmbedding;
        await pair.save();
      }
      const score = cosineSimilarity(userEmbedding, pairEmbedding);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pair;
      }
    }
    
    // Set a threshold for a confident match (e.g., 0.7)
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
