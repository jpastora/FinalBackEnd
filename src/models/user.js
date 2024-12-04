const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    secondName: { 
        type: String, 
        required: true 
    },
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    rol: { 
        type: String, 
        default: 'user' 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;



