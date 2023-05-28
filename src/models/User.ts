const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    balance: Number
});

const User = mongoose.model('User', userSchema);
exports.User = User;
export {};

//const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         trim: true
//     },
//     email: {
//         type: String,
//         trim: true
//     },
//     address: String,
//     balance: {
//         type: Number,
//         default: 0
//     }
// });
