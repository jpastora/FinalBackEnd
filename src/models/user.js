const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    profileImage: {
        type: String,
        default: null
    },
    rol: { 
        type: String, 
        default: 'user' 
    },
    eventosGuardados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento'
    }],
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;



