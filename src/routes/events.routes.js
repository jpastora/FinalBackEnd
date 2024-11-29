const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('eventos.html', { title: 'Eventos' });
});

router.get('/crear', (req, res) => {
    res.render('eventos/crearEvento.html', { title: 'Crear Evento' });
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