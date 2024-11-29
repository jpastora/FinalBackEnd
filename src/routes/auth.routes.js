
const express = require('express');
const router = express.Router();
const { login, register, recoverPassword, logout } = require('../controllers/auth.controller');

// Rutas POST para autenticación
router.post('/login', login);
router.post('/registerUser', register);
router.post('/recuperar-contrasena', recoverPassword);
router.get('/logout', logout);

// Rutas GET para renderizar vistas
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('auth/login.html', { 
        title: 'Iniciar Sesión',
        error: null
    });
});

router.get('/registro', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('auth/registro.html', { 
        title: 'Registro',
        error: null
    });
});

router.get('/recuperar-contrasena', (req, res) => {
    res.render('auth/recuperarContrasena.html', { 
        title: 'Recuperar Contraseña',
        error: null,
        success: null
    });
});

// Middleware de verificación de sesión activa
router.use((req, res, next) => {
    if (req.session.user && (req.path === '/login' || req.path === '/registro')) {
        return res.redirect('/');
    }
    next();
});

module.exports = router;