const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer.middleware.js');

const { getAllProducts, getAllProductsStatic, addProduct, deleteProduct } = require('../controllers/products');

router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);
// Use Multer middleware to handle file uploads in the POST route
router.route('/').post(upload.single('image'), addProduct);

router.route('/:id').delete(deleteProduct);


module.exports = router;