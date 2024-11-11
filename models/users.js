const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username must be provided'] },
    password: { type: String, required: [true, 'Password must be provided'] }
})

module.exports = mongoose.model('Users', UserSchema);