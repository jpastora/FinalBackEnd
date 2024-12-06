const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asegurarse que coincida con el nombre del modelo
        required: true
    },
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precioTotal: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagado', 'cancelado'],
        default: 'pendiente'
    },
    fechaCompra: {
        type: Date,
        default: Date.now
    },
    numeroTicket: {
        type: String,
        unique: true,
        default: function() {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            return `VT-${year}${month}${day}-${random}`;
        }
    },
    asiento: {
        type: String,
        default: 'General'
    }
});

// Eliminar el middleware pre-save ya que ahora usamos un valor por defecto
module.exports = mongoose.model('Ticket', ticketSchema);