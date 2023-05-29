const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    address: String,
    privateKey: String,
    balance: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);
exports.User = User;
export {};
