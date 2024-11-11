const usersModel = require('../models/users.js')

const authUser = async (username, password) => {

    const foundUser = await usersModel.findOne({ username });
    if (foundUser) {
        console.log("User Found:", foundUser);
    }
    else {
        return undefined;
    }
}

module.exports = authUser;