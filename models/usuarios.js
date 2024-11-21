const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/VibeTickets';

mongoose.connect(DB_URI, {})
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(() => console.log('Error al conectar a la base de datos'));

// Schema de usuarios
let usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    cedula: { type: Number, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    telefono: { type: Number, required: true }
}); {versionKey: false}

// Modelo de usuarios
let Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

