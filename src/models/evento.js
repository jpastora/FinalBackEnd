const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    lugar: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        enum: ['Deportes', 'Conciertos', 'Festivales', 'Teatro'],
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: '/img/default-event.png'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Evento', eventoSchema);