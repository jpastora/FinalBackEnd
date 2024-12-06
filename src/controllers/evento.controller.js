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
            descripcion: req.body.descripcion,
            imagen: req.file ? `/public/uploads/eventos/${req.file.filename}` : '/img/1733172139529-10.jpg'
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

// ...existing code...

const listarEventos = async (req, res) => {
    try {
        let { busqueda, categoria, lugar } = req.query;
        let query = {};

        // 1. Primero aplicar filtros exactos (lugar y categoría)
        if (lugar) query.lugar = lugar;
        if (categoria) query.categoria = categoria;

        // 2. Luego manejar la búsqueda por texto
        if (busqueda) {
            const searchQuery = {
                $or: [
                    { nombre: { $regex: busqueda, $options: 'i' } },
                    { descripcion: { $regex: busqueda, $options: 'i' } },
                    { categoria: { $regex: busqueda, $options: 'i' } }
                ]
            };

            // Si ya existen otros filtros, combinarlos con AND
            query = Object.keys(query).length > 0 ? 
                { $and: [searchQuery, query] } : 
                searchQuery;
        }

        console.log('Query final:', JSON.stringify(query, null, 2));

        const eventos = await Evento.find(query)
            .sort({ fecha: 1 })
            .exec();

        console.log(`Eventos encontrados: ${eventos.length}`);
        
        // Mantener todos los filtros en la respuesta
        res.render('eventos.html', {
            eventos,
            filtros: {
                busqueda: busqueda || '',
                categoria: categoria || '',
                lugar: lugar || ''
            }
        });

    } catch (error) {
        console.error('Error en listarEventos:', error);
        res.render('eventos.html', {
            eventos: [],
            error: 'Error al buscar eventos',
            filtros: { busqueda: '', categoria: '', lugar: '' }
        });
    }
};

// ...existing code...

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
        .limit(5);
        
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

const obtenerEventoPorId = async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({
                success: false,
                mensaje: 'Evento no encontrado'
            });
        }
        res.json({
            success: true,
            evento: {
                _id: evento._id,
                nombre: evento.nombre,
                lugar: evento.lugar,
                categoria: evento.categoria,
                precio: evento.precio,
                fecha: evento.fecha,
                hora: evento.hora,
                descripcion: evento.descripcion,
                imagen: evento.imagen,
                numerotickets: evento.numerotickets
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el evento',
            error: error.message
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

const listarEventosAdmin = async (req, res) => {
    try {
        const { busqueda } = req.query;
        let query = {};

        if (busqueda) {
            query = {
                $or: [
                    { nombre: { $regex: busqueda, $options: 'i' } },
                    { lugar: { $regex: busqueda, $options: 'i' } },
                    { categoria: { $regex: busqueda, $options: 'i' } }
                ]
            };
        }

        const eventos = await Evento.find(query).sort({ fecha: 1 });
        
        // Transformar los datos para la respuesta
        const eventosFormateados = eventos.map(evento => ({
            _id: evento._id,
            nombre: evento.nombre,
            fecha: evento.fecha,
            lugar: evento.lugar,
            categoria: evento.categoria,
            price: evento.precio,
            imagen: evento.imagen,
            descripcion: evento.descripcion,
            hora: evento.hora,
            numerotickets: evento.numerotickets
        }));

        res.json({ 
            success: true, 
            eventos: eventosFormateados 
        });
    } catch (error) {
        console.error('Error en listarEventosAdmin:', error);
        res.status(500).json({ 
            success: false, 
            mensaje: 'Error al listar eventos',
            error: error.message 
        });
    }
};

// ...existing code...

const eliminarEvento = async (req, res) => {
    try {
        const evento = await Evento.findByIdAndDelete(req.params.id);
        if (!evento) {
            return res.status(404).json({ 
                success: false, 
                mensaje: 'Evento no encontrado' 
            });
        }
        
        // Eliminar imagen asociada si existe
        if (evento.imagen && evento.imagen !== '/img/1733172139529-10.jpg') {
            const imagePath = path.join(__dirname, '../public', evento.imagen);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ success: true, mensaje: 'Evento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            mensaje: 'Error al eliminar evento',
            error: error.message 
        });
    }
};

module.exports = {
    crearEvento,
    listarEventos,
    obtenerEvento,
    obtenerEventoPorId,
    obtenerEventosHoy,
    obtenerProximosEventos,
    listarEventosAdmin,
    eliminarEvento
};