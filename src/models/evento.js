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

// Agregar método estático para crear eventos
eventoSchema.statics.crearEvento = async function(eventoData) {
  try {
    const evento = new this(eventoData);
    return await evento.save();
  } catch (error) {
    throw error;
  }
};

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;