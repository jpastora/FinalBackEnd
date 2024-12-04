
const { Admin } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    rol: String
});

// Modelo de usuarios
const User = mongoose.model('User', userSchema);

const User = require('../models/user');

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

module.exports = User;



