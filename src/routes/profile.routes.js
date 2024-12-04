const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Agregar esta línea

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

router.get('/eventos-guardados', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/auth/login');
        }
        
        const user = await User.findById(req.session.user._id)
            .populate('eventosGuardados');
        
        if (!user) {
            return res.status(404).render('error.html', { 
                message: 'Usuario no encontrado' 
            });
        }
        
        res.render('user/perfilEventosGuardados.html', { 
            title: 'Eventos Guardados',
            eventos: user.eventosGuardados
        });
    } catch (error) {
        console.error('Error en eventos guardados:', error);
        res.status(500).render('error.html', { 
            message: 'Error al cargar eventos guardados' 
        });
    }
});

router.get('/mis-tickets', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
            .populate({
                path: 'tickets',
                populate: {
                    path: 'evento'
                }
            });
        
        res.render('user/perfilMisTickets.html', { 
            title: 'Mis Tickets',
            tickets: user.tickets
        });
    } catch (error) {
        res.status(500).render('error.html', { message: error.message });
    }
});

module.exports = router;