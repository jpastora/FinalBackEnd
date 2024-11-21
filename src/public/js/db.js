const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/registro';

mongoose.connect(DB_URI, {})
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.error(err));