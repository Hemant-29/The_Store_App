const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    type: { type: String, enum: { values: ["office", "home"], message: '{VALUE} is not supported!' }, default: 'home' },
    isDefault: { type: Boolean, default: false },
    person: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: Number, required: true },
});

module.exports = mongoose.model('Address', addressSchema);