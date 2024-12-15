const mongoose = require('mongoose');
const ReviewModel = require('./reviews')


const productSchema = new mongoose.Schema({
    // Basic
    name: { type: String, required: [true, 'product name must be provided'] },
    image: [{ type: String }],
    description: { type: String },
    company: { type: String },
    features: [{ type: String }],
    createdAt: { type: Date, default: Date.now() },

    // Choise
    color: [{ type: String }],
    size: [{ type: String }],

    // advanced
    specifications: {
        type: Object, default: {} // Default to an empty object
    },
    additionalInfo: {
        type: Object, default: {} // Default to an empty object
    },
    stock: { type: Number, default: 0, required: true },

    // Category Info
    category: { type: String, default: "general" },
    tags: [{ type: String }],



    // Price Related
    price: { type: Number, required: [true, 'product price must be provided'] },
    mrp: { type: Number },
    discount: { type: Number },
    offers: [{ offer: { type: String }, description: { type: String }, amount: { type: Number } }],

    // Policy
    replacement: { type: String },
    return: { type: String },


    // Ratings and reviews
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],



    featured: { type: Boolean, default: false },

})

module.exports = mongoose.model('Product', productSchema);
