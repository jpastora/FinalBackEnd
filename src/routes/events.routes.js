const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Agregar esta línea
const eventoController = require('../controllers/evento.controller');
const upload = require('../middleware/upload');
const Evento = require('../models/evento');
const User = require('../models/user'); // Agregar esta línea

// Asegurarse que todas las rutas usen el controlador correcto
router.get('/', eventoController.listarEventos);

router.get('/crear', (req, res) => {
    res.render('eventos/crearEvento.html', { title: 'Crear Evento' });
});

router.post('/crear', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requiere una imagen'
            });
        }

        const eventoData = {
            ...req.body,
            imagen: `/uploads/${req.file.filename}` 
        };

        const evento = new Evento(eventoData);
        await evento.save();

        res.status(201).json({
            success: true,
            mensaje: 'Evento creado exitosamente',
            evento
        });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear el evento',
            error: error.message
        });
    }
});

router.post('/guardar/:id', async (req, res) => {
    try {
        console.log('Sesión actual:', req.session); // Debug log
        
        if (!req.session) {
            console.log('No hay sesión');
            return res.status(401).json({
                success: false,
                message: 'No hay sesión activa'
            });
        }

        if (!req.session.user) {
            console.log('No hay usuario en sesión');
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        console.log('ID de usuario en sesión:', req.session.user._id); // Debug log

        if (!req.session || !req.session.user || !req.session.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const eventoId = req.params.id;
        const userId = req.session.user._id.toString(); // Asegurar que sea string

        // Verificar ambos IDs
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(eventoId)) {
            console.error('ID inválido:', { userId, eventoId });
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }
        
        const [user, evento] = await Promise.all([
            User.findById(userId),
            Evento.findById(eventoId)
        ]);

        if (!user) {
            console.error('Usuario no encontrado:', userId);
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        // Verificar si el evento ya está guardado
        if (user.eventosGuardados.includes(eventoId)) {
            return res.json({
                success: true,
                message: 'El evento ya estaba guardado'
            });
        }

        // Guardar evento
        user.eventosGuardados.push(eventoId);
        await user.save();
        
        res.json({ 
            success: true, 
            message: 'Evento guardado exitosamente' 
        });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al guardar el evento: ' + error.message 
        });
    }
});

router.get('/editar', (req, res) => {
    res.render('eventos/editarEventos.html', { title: 'Editar Eventos' });
});

router.get('/evento', (req, res) => {
    res.render('eventos/evento.html', { title: 'Evento' });
});

router.get('/evento2', (req, res) => {
    res.render('eventos/evento2.html', { title: 'Evento 2' });
});

router.get('/categorias', (req, res) => {
    res.render('eventos/categorias.html', { title: 'Categorías' });
});

module.exports = router;