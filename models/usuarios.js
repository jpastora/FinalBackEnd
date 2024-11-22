
const mongoose = require('mongoose');

// Schema de usuarios
let userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    secondName: { type: String, required: true, trim: true },
    id: { type: String, required: true, unique: true, minlength: 9 },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true,},
    rol: { type: String, default: 'user' },
});

// Modelo de usuarios
let User = mongoose.model('User', userSchema);

module.exports = User;

