// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    eid: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['admin', 'delivery', 'packager'] },
    workID: { type: String, unique: true },
    availabilityStatus: { type: String, default: 'available' },
});

employeeSchema.pre('save', function (next) {
    // Generate a unique workID using timestamp or any other logic
    this.workID = `WORK-${Date.now()}`;
    next();
});

module.exports = mongoose.model('Employee', employeeSchema);
