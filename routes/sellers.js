const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer.middleware.js');
const authenticateToken = require('../middleware/authenticateToken');
const { getSeller, getAllSellers, addSeller, loginSeller, logoutSeller, deleteSeller, getAllProducts, getAllUserProducts, addProduct, addProductImage, deleteProduct } = require('../controllers/sellers')

// User Account Routes
router.route('/').get(authenticateToken, getSeller);
router.route('/all').get(getAllSellers);
router.route('/signup').post(addSeller);
router.route('/login').post(loginSeller);
router.route('/logout').post(logoutSeller);
router.route('/:sellerId').delete(deleteSeller);

// User Products Routes
router.route('/products').get(authenticateToken, getAllUserProducts);
router.route('/products/all').get(authenticateToken, getAllProducts);
router.route('/product/').post(authenticateToken, addProduct);
router.route('/product/image/').post(upload.single('image'), authenticateToken, addProductImage);
router.route('/product/:productId').delete(authenticateToken, deleteProduct);

module.exports = router;