const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderUsername: { type: String, required: true },
  message: { type: String, required: true },
  isDelivered: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  visibleForMe: { type: Boolean, default: true },
  visibleForAll: { type: Boolean, default: true },
}, { timestamps: true }); // Add timestamps to track when each message was created

const chatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true }, // The chat's unique ID (M ID)
  usernames: { type: [String], required: true }, // Array of usernames participating in the chat
  messages: [messageSchema], // Array of message objects
}, { timestamps: true }); // Add timestamps to track when the chat was created/updated

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
