const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Town = require('./location');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  history: {
    search: {
      type: Map,
      of: Number, // Store search counts per category
      default: {}
    },
    click: {
      type: Map,
      of: Number, // Store click counts per product ID
      default: {}
    }
  },

}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('Buyer', UserSchema);

