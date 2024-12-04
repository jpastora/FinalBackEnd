const mongoose = require('mongoose');

const eventoGuardadoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento', // Asegúrate de que coincida con el nombre del modelo
        required: true
    }
}, {
    timestamps: true
});

// Índice compuesto para evitar duplicados
eventoGuardadoSchema.index({ userId: 1, eventoId: 1 }, { unique: true });

module.exports = mongoose.model('EventoGuardado', eventoGuardadoSchema);