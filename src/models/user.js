const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    secondName: String,
    id: String,
    email: String,
    password: String,
    phone: String,
    rol: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;



