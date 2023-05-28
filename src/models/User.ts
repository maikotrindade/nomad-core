const mongoose = require('mongoose');

const UserModel = mongoose.model('User', {
    name: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true, 
        trim: true
    },
    address: String,
    balance: {
        type: Number,
        default: 0
    }
});

module.exports = UserModel;
export {};