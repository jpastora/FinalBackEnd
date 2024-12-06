const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');

// Asegurarse que esta ruta esté antes de las rutas con parámetros
router.get('/eventos/listar', eventoController.listarEventosAdmin);

router.get('/eventos/:id', eventoController.obtenerEventoPorId);
router.delete('/eventos/:id', eventoController.eliminarEvento);

router.get('/', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

router.get('/datos-personales', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

router.get('/seguridad', (req, res) => {
    res.render('admin/adminSeguridad.html', { title: 'Seguridad' });
});

router.get('/metodos-pago', (req, res) => {
    res.render('admin/adminMetodosPago.html', { title: 'Métodos de Pago' });
});

router.get('/usuarios', (req, res) => {
    res.render('admin/administrarUsuarios.html', { title: 'Administrar Usuarios' });
});

router.get('/eventos', (req, res) => {
    res.render('admin/adminEventos.html', { title: 'Administrar Eventos' });
});

router.get('/editar-evento', (req, res) => {
    res.render('admin/adminEditarEventos.html', { title: 'Editar Evento' });
});

router.get('/crear-evento', (req, res) => {
    res.render('admin/adminCrearEvento.html', { title: 'Crear Evento' });
});

const { checkUserRole } = require('../middleware/auth');

// Protected routes with admin role check
router.get('/', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

router.get('/datos-personales', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

router.get('/usuarios', checkUserRole('admin'), (req, res) => {
    res.render('admin/administrarUsuarios.html', { title: 'Administrar Usuarios' });
});

router.get('/eventos', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminEventos.html', { title: 'Administrar Eventos' });
});

router.get('/editar-evento', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminEditarEventos.html', { title: 'Editar Evento' });
});

router.get('/crear-evento', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminCrearEvento.html', { title: 'Crear Evento' });
});

module.exports = router;