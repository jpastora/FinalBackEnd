const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del evento es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del evento es requerida'],
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    lugar: {
        type: String,
        required: [true, 'El lugar es requerido'],
        enum: ['sanJose', 'Heredia', 'Alajuela', 'Cartago', 'Limon', 'Puntarenas', 'Guanacaste']
    },
    categoria: {
        type: String,
        enum: ['Deportes', 'Conciertos', 'Festivales', 'Teatro', 'Comedia', 'Charlas'],
        required: [true, 'La categoría es requerida']
    },
    numerotickets: {
        type: Number,
        required: [true, 'El número de tickets es requerido'],
        min: [1, 'Debe haber al menos 1 ticket disponible']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es requerida'],
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'La fecha debe ser futura'
        }
    },
    hora: {
        type: String,
        required: [true, 'La hora es requerida'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido']
    },
    imagen: {
        type: String,
        default: '/img/default-event.png'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Evento', eventoSchema);