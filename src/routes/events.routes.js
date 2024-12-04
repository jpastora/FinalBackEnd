const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');
const upload = require('../middleware/upload');
const Evento = require('../models/evento');

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