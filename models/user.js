const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    Date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', userSchema)