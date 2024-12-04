const Chat = require('../models/Chat');
const { v4: uuidv4 } = require('uuid');
// Create Chat

exports.getchats = async (req, res) => {
  try {
    const chats = await Chat.find({}).lean(); // Fetch only relevant fields
    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found" });
    }
    res.status(200).json(chats); // Directly send an array of chats
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats", details: error.message });
  }
};


exports.createChat = async (req, res) => {
  try {
    const { usernames } = req.body;

    const chatId = uuidv4();
    if (!chatId || !usernames || usernames.length < 2) {
      return res.status(400).json({ message: 'chatId and at least two usernames are required' });
    }

    const existingChat = await Chat.findOne({ chatId });
    if (existingChat) {
      return res.status(400).json({ message: 'Chat ID already exists' });
    }

    const newChat = new Chat({ chatId, usernames, messages: [] });
    await newChat.save();

    res.status(201).json({ message: 'Chat created successfully', chat: newChat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create chat', error: error.message });
  }
};

// Send a Message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderUsername, message } = req.body;

    if (!chatId || !senderUsername || !message) {
      return res.status(400).json({ message: 'chatId, senderUsername, and message are required' });
    }

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.push({
      senderUsername,
      message,
      isSent: true,
    });

    await chat.save();
    res.status(201).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// Delete a Message for Me
exports.deleteMessageForMe = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.visibleForMe = false;
    await chat.save();

    res.status(200).json({ message: 'Message deleted for you', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message for you', error: error.message });
  }
};

// Delete a Message for All
exports.deleteMessageForAll = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.visibleForAll = false;
    await chat.save();

    res.status(200).json({ message: 'Message deleted for all', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message for all', error: error.message });
  }
};

// Mark as Delivered
exports.markAsDelivered = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isDelivered = true;
    await chat.save();

    res.status(200).json({ message: 'Message marked as delivered', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message as delivered', error: error.message });
  }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    await chat.save();

    res.status(200).json({ message: 'Message marked as read', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message as read', error: error.message });
  }
};
