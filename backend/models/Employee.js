const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    workID: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    availabilityStatus: { type: String, default: 'available' },
    active: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    dateJoined: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

employeeSchema.pre('save', async function (next) {
    if (!this.workID) {
        this.workID = `WORK-${Date.now()}`;
    }
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
