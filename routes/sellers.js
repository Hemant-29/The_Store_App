const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer.middleware.js');
const authenticateToken = require('../middleware/authenticateToken');

const { getSeller, getAllSellers, addSeller, loginSeller, deleteSeller, getAllProducts, getAllUserProducts, addProduct, deleteProduct } = require('../controllers/sellers')

// User Account Routes
router.route('/').get(authenticateToken, getSeller);
router.route('/all').get(getAllSellers);
router.route('/signup').post(addSeller);
router.route('/login').post(loginSeller)
router.route('/:sellerId').delete(deleteSeller)

// User Products Routes
router.route('/products').get(getAllProducts);
router.route('/products/:userId').get(getAllUserProducts);
router.route('/product/:userId').post(upload.single('image'), addProduct);
router.route('/product/:productId').delete(authenticateToken, deleteProduct);

module.exports = router;