const express = require("express");
const router = express.Router();

// import controllers
const user = require("../controllers/users")


// Public Requests
router.route('/user/:userId').get(user.getUserPublic);


module.exports = router;