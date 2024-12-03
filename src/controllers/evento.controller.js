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
            'Deportes': 'Deportes',
            'Conciertos': 'Conciertos',
            'Festivales': 'Festivales',
            'Teatro': 'Teatro',
            'Comedia': 'Comedia',
            'Charlas': 'Charlas'
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
        const { categoria } = req.query;
        const filtro = categoria ? { categoria } : {};
        
        const eventos = await Evento.find(filtro)
            .sort({ fecha: 1 })
            .select('nombre lugar categoria precio fecha hora imagen');
        
        res.render('eventos.html', { 
            title: categoria ? `Eventos - ${categoria}` : 'Eventos',
            eventos: eventos,
            categoriaActual: categoria || '',
            error: null
        });
    } catch (error) {
        console.error('Error al listar eventos:', error);
        res.render('eventos.html', {
            title: 'Eventos',
            eventos: [],
            categoriaActual: '',
            error: 'Error al cargar los eventos'
        });
    }
};

const obtenerEvento = async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).render('error.html', {
                title: 'Evento no encontrado',
                mensaje: 'El evento que buscas no existe'
            });
        }
        
        const eventosRelacionados = await Evento.find({
            categoria: evento.categoria,
            _id: { $ne: evento._id },
            fecha: { $gte: new Date() }
        })
        .sort({ fecha: 1 })
        .limit(3);
        
        return res.render('eventos/evento.html', {
            title: evento.nombre,
            evento,
            eventosRelacionados
        });
    } catch (error) {
        console.error('Error al obtener evento:', error);
        return res.status(500).render('error.html', {
            title: 'Error del servidor',
            mensaje: 'Error al cargar el evento. Por favor, inténtalo más tarde.'
        });
    }
};

const obtenerEventosHoy = async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    return await Evento.find({
        fecha: {
            $gte: hoy,
            $lt: mañana
        }
    })
    .sort({ hora: 1 })
    .limit(4);
};

const obtenerProximosEventos = async () => {
    const hoy = new Date();
    return await Evento.find({
        fecha: { $gt: hoy }
    })
    .sort({ fecha: 1 })
    .limit(3);
};

module.exports = {
    crearEvento,
    listarEventos,
    obtenerEvento,
    obtenerEventosHoy,
    obtenerProximosEventos
};