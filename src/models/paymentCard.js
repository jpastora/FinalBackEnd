
const mongoose = require('mongoose');

const paymentCardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardholderName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    lastFourDigits: {
        type: String
    }
}, { timestamps: true });

// Antes de guardar, solo almacenar los últimos 4 dígitos
paymentCardSchema.pre('save', function(next) {
    if (this.cardNumber) {
        this.lastFourDigits = this.cardNumber.slice(-4);
        this.cardNumber = this.lastFourDigits; // Por seguridad solo guardamos los últimos 4 dígitos
    }
    next();
});

const PaymentCard = mongoose.model('PaymentCard', paymentCardSchema);
module.exports = PaymentCard;