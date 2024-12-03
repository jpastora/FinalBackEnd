const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');

// Rutas principales
router.get('/', async (req, res) => {
    try {
        const eventosHoy = await eventoController.obtenerEventosHoy();
        const proximosEventos = await eventoController.obtenerProximosEventos();
        res.render('inicio.html', { 
            title: 'Inicio',
            eventosHoy,
            proximosEventos
        });
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        res.render('inicio.html', { 
            title: 'Inicio',
            eventosHoy: [],
            proximosEventos: []
        });
    }
});

router.get('/nosotros', (req, res) => {
    res.render('nosotros.html', { title: 'Nosotros' });
});

router.get('/ayuda', (req, res) => {
    res.render('ayuda.html', { title: 'Ayuda' });
});

// Rutas de eventos
router.get('/eventos', eventoController.listarEventos);

router.get('/eventos/crear', (req, res) => {
    res.render('eventos/crearEvento.html', { title: 'Crear Evento' });
});

router.get('/eventos/editar', (req, res) => {
    res.render('eventos/editarEventos.html', { title: 'Editar Eventos' });
});

router.get('/eventos/evento', (req, res) => {
    res.render('eventos/evento.html', { title: 'Evento' });
});

router.get('/eventos/evento2', (req, res) => {
    res.render('eventos/evento2.html', { title: 'Evento 2' });
});

router.get('/eventos/categorias', (req, res) => {
    res.render('eventos/categorias.html', { title: 'Categorías' });
});

// Rutas de perfil
router.get('/perfil', (req, res) => {
    res.redirect('/perfil/datos-personales');
});

router.get('/perfil/datos-personales', (req, res) => {
    res.render('user/perfilDatosPers.html', { title: 'Datos Personales' });
});

router.get('/perfil/seguridad', (req, res) => {
    res.render('user/perfilSeguridad.html', { title: 'Seguridad' });
});

router.get('/perfil/metodospago', (req, res) => {
    res.render('user/perfilMetodosPago.html', { title: 'Métodos de Pago' });
});

router.get('/perfil/eventos-guardados', (req, res) => {
    res.render('user/perfilEventosGuardados.html', { title: 'Eventos Guardados' });
});

router.get('/perfil/mis-tickets', (req, res) => {
    res.render('user/perfilMisTickets.html', { title: 'Mis Tickets' });
});

// Rutas de pago
router.get('/pago', (req, res) => {
    res.render('pago/pagos.html', { title: 'Pago' });
});

router.get('/pago/carrito', (req, res) => {
    res.render('pago/pagos.html', { title: 'Carrito' });
});

router.get('/pago/seleccion', (req, res) => {
    res.render('pago/seleccion_pago.html', { title: 'Seleccionar Pago' });
});

router.get('/pago/resumen', (req, res) => {
    res.render('pago/resumen_compra.html', { title: 'Resumen de Compra' });
});

router.get('/pago/confirmacion', (req, res) => {
    res.render('pago/pago_completado.html', { title: 'Confirmación de Pago' });
});

// Rutas de administrador
router.get('/admin', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

router.get('/admin/datos-personales', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

router.get('/admin/seguridad', (req, res) => {
    res.render('admin/adminSeguridad.html', { title: 'Seguridad' });
});

router.get('/admin/metodos-pago', (req, res) => {
    res.render('admin/adminMetodosPago.html', { title: 'Métodos de Pago' });
});

router.get('/admin/usuarios', (req, res) => {
    res.render('admin/administrarUsuarios.html', { title: 'Administrar Usuarios' });
});

router.get('/admin/eventos', (req, res) => {
    res.render('admin/adminEventos.html', { title: 'Administrar Eventos' });
});

router.get('/admin/editar-evento', (req, res) => {
    res.render('admin/adminEditarEventos.html', { title: 'Editar Evento' });
});

router.get('/admin/crear-evento', (req, res) => {
    res.render('admin/adminCrearEvento.html', { title: 'Crear Evento' });
});

module.exports = router;