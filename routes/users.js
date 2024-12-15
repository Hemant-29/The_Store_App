const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

const { getUser, getAllUsers, addUser, loginUser, logoutUser, addToCart, getCart, deleteFromCart, updateLoginInfo, updatePersonalInfo, updateAddressInfo, addNewAddress, deleteAddress, getAllAddress, makeDefaultAddress, getWishList, addToWishlist, deleteWishlist, addReview, getReviews, deleteReview, upvoteReview } = require('../controllers/users')


// Basic User Routes
router.route('/').get(authenticateToken, getUser);
router.route('/all').get(getAllUsers);
router.route('/signup').post(addUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

// Update User Routes
router.route('/update/login').patch(authenticateToken, updateLoginInfo);
router.route('/update/personal').patch(authenticateToken, updatePersonalInfo);

// Address Routes

router.route('/address').get(authenticateToken, getAllAddress);
router.route('/update/address/new').post(authenticateToken, addNewAddress);
router.route('/update/address/:addressID').patch(authenticateToken, updateAddressInfo);
router.route('/update/address/:addressID').delete(authenticateToken, deleteAddress);
router.route('/update/address/default/:addressID').post(authenticateToken, makeDefaultAddress);

// WishList Routes
router.route('/wishlist').get(authenticateToken, getWishList);
router.route('/wishlist/create').post(authenticateToken, addToWishlist);
router.route('/wishlist/delete').delete(authenticateToken, deleteWishlist);

// User Products Route
router.route('/product/addtocart/:id').put(authenticateToken, addToCart);
router.route('/product/cart').get(authenticateToken, getCart);
router.route('/product/cart/delete/:id').delete(authenticateToken, deleteFromCart);


// Product Review Routes
router.route('/review/add/:id').post(authenticateToken, addReview);
router.route('/review/all').get(authenticateToken, getReviews);
router.route('/review/delete/:reviewId').delete(authenticateToken, deleteReview);

router.route('/review/upvote/:reviewId').post(authenticateToken, upvoteReview);



module.exports = router;