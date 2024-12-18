const express = require("express");
const router = express.Router();

// import controllers
const user = require("../controllers/users")

const healthFunction = (req, res) => {
    res.status(200).send('Backend is running');
};

// Public Requests
router.route('/user/:userId').get(user.getUserPublic);
router.route('/health').get(healthFunction);



module.exports = router;