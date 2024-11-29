
const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  lugar: {
    type: String,
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
  categoria: {
    type: String,
    enum: ['Conciertos', 'Partidos', 'Comedia', 'Deportes', 'Festivales', 'Charlas', 'Teatro'],
    required: true
  },
  imagen: {
    type: String,  // URL de la imagen
    required: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;