const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

const { getUser, getAllUsers, addUser, loginUser } = require('../controllers/users')

router.route('/').get(authenticateToken, getUser);
router.route('/all').get(getAllUsers);
router.route('/signup').post(addUser);
router.route('/login').post(loginUser)

module.exports = router;