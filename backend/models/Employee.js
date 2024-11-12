const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    eid: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['admin', 'delivery', 'packager'] },
    workID: { type: String, unique: true },
    availabilityStatus: { type: String, default: 'available' },
});

employeeSchema.pre('save', async function (next) {
    // Generate a unique workID if not set
    if (!this.workID) {
        this.workID = `WORK-${Date.now()}`;
    }

    // Only hash the password if it has been modified
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
