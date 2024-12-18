const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deliveryPersonnelSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  idnumber: {type: Number, required: true},
  vehicle_type: { type: String, required: true},
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  town: { type: String, required: true },
  townspecificroute: { type: String, required: true },
  deliveryPersonnumber: {type: String, required: true},
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
  passwordRecoveryToken: { type: String, default: undefined },
  tokenExpiry: { type: Date, default: undefined },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  amount: { type: Number, default: undefined},

  packeges: [{
    boxid: {type: String, required: true},
    processedDate: { type: Date, default: Date.now },
    isdelivered: { type: Boolean, default: false },
  }],

}, { timestamps: true });

deliveryPersonnelSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('DeliveryPersonnel', deliveryPersonnelSchema);


