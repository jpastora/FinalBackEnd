
const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tickets: [{
        evento: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evento',
            required: true
        },
        cantidad: Number,
        precioUnitario: Number,
        precioTotal: Number
    }],
    total: Number,
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['completado', 'pendiente', 'cancelado'],
        default: 'completado'
    }
});

module.exports = mongoose.model('Orden', ordenSchema);