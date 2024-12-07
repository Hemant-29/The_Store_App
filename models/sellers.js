const mongoose = require('mongoose');
const ProductModel = require('./products')


const BoughtProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
    }, boughtAt: { type: Date, default: Date.now }
});

const SellerSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username must be provided'] },
    password: { type: String, required: [true, 'Password must be provided'] },
    products: [ProductModel.schema],
    orderedProducts: [ProductModel.schema]
})

module.exports = mongoose.model('Sellers', SellerSchema);