const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer.middleware.js');

const { getProduct, getAllProducts, getAllProductsStatic, getAllReviews, buyProduct } = require('../controllers/products');

router.route('/single/:id').get(getProduct);
router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);

// Reviews routes
router.route('/reviews/:productId').get(getAllReviews);

// Buy a Product
// router.route('/buy/:productID').post(buyProduct);

module.exports = router;