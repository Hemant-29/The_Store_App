const mongoose = require('mongoose');
const ProductModel = require('./products');
const UsersModel = require('./users');

// Order Schema
const OrderSchema = new mongoose.Schema({
    buyerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Payment Details
    amount: { type: Number },
    paymentAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },

    // Delivery Details
    orderDate: { type: Date, default: Date.now },
    expectedDelivery: { type: Date },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, // Correctly reference the address schema
});

// Sold Product Schema
const SoldProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amount: { type: Number },
    buyer: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
    },
    soldAt: { type: Date, default: Date.now },
    deliveryAt: { type: Date },
    paymentMethod: { type: String, required: true },
    paymentAmount: { type: Number, required: true },
});

const SellerSchema = new mongoose.Schema({
    // Basic Information
    username: { type: String, required: [true, 'Username must be provided'] },
    password: { type: String, required: [true, 'Password must be provided'] },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },

    // Products
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Ratings and Reviews
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    // Account Status
    accountStatus: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },

    // Products Sold
    soldProducts: [SoldProductSchema],

    // Orders
    currentOrders: [OrderSchema],

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
SellerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Sellers', SellerSchema);
