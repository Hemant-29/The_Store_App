const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        rating: { type: Number, required: true },
        date: { type: Date, default: Date.now, required: true },
        details: { type: String, required: true },
        review: { type: String, required: true },
        upvotes: { type: Number, default: 0 }
    }
);

const productSchema = new mongoose.Schema({
    // Basic
    name: { type: String, required: [true, 'product name must be provided'] },
    description: { type: String },
    feautres: [{ type: String }],
    company: { type: String, enum: { values: ['ikea', 'liddy', 'caressa', 'macros'], message: '{VALUE} is not supported!' } },
    image: { type: String },

    // advanced
    specifications: {
        type: Object, default: {} // Default to an empty object
    },
    additionalInfo: {
        type: Object, default: {} // Default to an empty object
    },


    // Price Related
    price: { type: Number, required: [true, 'product price must be provided'] },
    mrp: { type: Number },
    discount: { type: Number },
    offers: [{ offer: { type: String }, amount: { type: Number } }],

    // Policy
    replacement: { type: String },
    return: { type: String },


    // Ratings and reviews
    rating: { type: Number, default: 4 },
    rating_count: { type: Number, default: 0 },
    reviews: [{}],


    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },

})

module.exports = mongoose.model('Product', productSchema);
