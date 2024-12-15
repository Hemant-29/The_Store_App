const mongoose = require('mongoose');
const ProductModel = require('./products')
const AddressModel = require('./address');
const PaymentModel = require('./payment')


const UserSchema = new mongoose.Schema({
    // Login Details
    username: { type: String, required: [true, 'Username must be provided'], unique: [true, 'Username must be Unique'] },
    password: { type: String, required: [true, 'Password must be provided'] },
    createdAt: { type: Date, default: Date.now },

    // Personal Details
    name: { type: String },
    email: { type: String, unique: [true, "This Email ID already Exists"] },
    phone: {
        type: Number,
        unique: [true, "This Mobile Number already Exists"],
        min: [100000, "Enter a valid Phone number!"],
        max: [9999999999, "Enter a valid Phone number!"],
    },
    age: { type: Number, min: 18, max: 120 },
    gender: { type: String },

    // Address details
    address: [{ type: AddressModel.schema }],

    // User Cart
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true, min: 1 },
    }],

    // User Favorites
    wishlist: [{
        listName: { type: String, default: "liked", unique: [true, 'List with similar name already exists!'] },
        product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    }],

    // User Orders
    orders: [{
        productName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        totalPrice: { type: Number },
        invoice: { type: String }, //Link to the pdf invoice
        paymentMethod: { type: String },
        shippingAddress: { type: String },
        paymentSummary: { type: PaymentModel.schema }
    }],

    // User Reviews
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
})

module.exports = mongoose.model('Users', UserSchema);

