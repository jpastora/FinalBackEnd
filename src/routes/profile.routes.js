const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/perfil/datos-personales');
});

router.get('/datos-personales', (req, res) => {
    res.render('user/perfilDatosPers.html', { title: 'Datos Personales' });
});

router.get('/seguridad', (req, res) => {
    res.render('user/perfilSeguridad.html', { title: 'Seguridad' });
});

router.get('/metodospago', (req, res) => {
    res.render('user/perfilMetodosPago.html', { title: 'Métodos de Pago' });
});

router.get('/eventos-guardados', (req, res) => {
    res.render('user/perfilEventosGuardados.html', { title: 'Eventos Guardados' });
});

router.get('/mis-tickets', (req, res) => {
    res.render('user/perfilMisTickets.html', { title: 'Mis Tickets' });
});

module.exports = router;