const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const eventoController = require('../controllers/evento.controller');
const upload = require('../middleware/upload');
const Evento = require('../models/evento');
const User = require('../models/user');
const { isAuth } = require('../middleware/checkAuth'); // Agregar esta línea
const EventoGuardado = require('../models/eventoGuardado'); // Agregar esta línea

// Asegurarse que todas las rutas usen el controlador correcto
router.get('/', eventoController.listarEventos);

router.get('/crear', (req, res) => {
    res.render('eventos/crearEvento.html', { title: 'Crear Evento' });
});

// Cambiamos upload.single por upload.eventos.single
router.post('/crear', upload.eventos.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                mensaje: 'Se requiere una imagen'
            });
        }

        const eventoData = {
            ...req.body,
            // Corregir la ruta para que coincida con la estructura de carpetas
            imagen: `/uploads/eventos/${req.file.filename}` 
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

// Ruta para guardar evento
router.post('/guardar/:eventoId', isAuth, async (req, res) => {
    try {
        const { eventoId } = req.params;
        const userId = req.session.user._id;

        // Verificar si el evento existe
        const eventoExiste = await Evento.findById(eventoId);
        if (!eventoExiste) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        // Guardar en ambos modelos
        await Promise.all([
            // Guardar en EventoGuardado
            EventoGuardado.findOneAndUpdate(
                { userId, eventoId },
                { userId, eventoId },
                { upsert: true }
            ),
            // Actualizar array en User
            User.findByIdAndUpdate(
                userId,
                { $addToSet: { eventosGuardados: eventoId } }
            )
        ]);

        res.json({
            success: true,
            message: 'Evento guardado exitosamente'
        });
    } catch (error) {
        console.error('Error al guardar evento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar el evento'
        });
    }
});

// Ruta para eliminar evento guardado
router.delete('/eliminar-guardado/:eventoId', isAuth, async (req, res) => {
    try {
        const { eventoId } = req.params;
        const userId = req.session.user._id;

        // Eliminar de ambos modelos
        await Promise.all([
            // Eliminar de EventoGuardado
            EventoGuardado.findOneAndDelete({ userId, eventoId }),
            // Eliminar del array de eventos guardados del usuario
            User.findByIdAndUpdate(userId, {
                $pull: { eventosGuardados: eventoId }
            })
        ]);

        res.json({
            success: true,
            message: 'Evento eliminado de guardados exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar evento guardado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el evento guardado'
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