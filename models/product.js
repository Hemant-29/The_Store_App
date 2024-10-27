const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'product name must be provided'] },
    price: { type: Number, requied: [true, 'product price must be provided'] },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4 },
    createdAt: { type: Date, default: Date.now() },
    company: { type: String, enum: { values: ['ikea', 'liddy', 'caressa', 'macros'], message: '{VALUE} is not supported!' } },
    image: { type: String }
})

module.exports = mongoose.model('Product', productSchema);
