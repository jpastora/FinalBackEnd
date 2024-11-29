const Evento = require('../models/evento');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../uploads/eventos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const crearEvento = [upload.single('imagenEvento'), async (req, res) => {
    try {
        const { titulo, lugar, categoria, precio, fecha, hora } = req.body;
        
        const categoriaMap = {
            'category-1': 'Deportes',
            'category-2': 'Conciertos',
            'category-3': 'Festivales',
            'category-4': 'Teatro'
        };

        const nuevoEvento = new Evento({
            nombre: titulo,
            lugar,
            categoria: categoriaMap[categoria],
            precio: Number(precio),
            fecha: new Date(fecha),
            hora,
            imagen: req.file ? `/uploads/eventos/${req.file.filename}` : '/img/default-event.png'
        });

        await nuevoEvento.save();
        
        res.status(201).json({
            success: true,
            mensaje: 'Evento creado exitosamente',
            eventoId: nuevoEvento._id
        });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear el evento',
            error: error.message
        });
    }
}];

const listarEventos = async (req, res) => {
    try {
        console.log('Consultando eventos en MongoDB...');
        const eventos = await Evento.find()
            .sort({ fecha: 1 })
            .lean();

        console.log('Eventos encontrados:', eventos);

        const eventosFormateados = eventos.map(evento => ({
            ...evento,
            fecha: evento.fecha.toLocaleDateString('es-ES'),
            precio: evento.precio.toFixed(2)
        }));

        return res.render('eventos.html', {
            title: 'Eventos',
            eventos: eventosFormateados,
            error: null
        });
    } catch (error) {
        console.error('Error al listar eventos:', error);
        return res.render('eventos.html', {
            title: 'Eventos',
            eventos: [],
            error: 'Error al cargar los eventos: ' + error.message
        });
    }
};

module.exports = {
    crearEvento,
    listarEventos
};