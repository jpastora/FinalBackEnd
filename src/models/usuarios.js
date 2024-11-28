
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    secondName: String,
    id: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    rol: {
        type: String,
        default: 'user'
    }
});

module.exports = mongoose.model('User', userSchema);