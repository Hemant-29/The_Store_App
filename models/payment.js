const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    itemSubtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    cashOnDeliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
})

module.exports = mongoose.model('Payment', paymentSchema)