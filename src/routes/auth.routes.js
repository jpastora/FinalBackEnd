const express = require('express');
const router = express.Router();
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const authController = require('../controllers/auth.controller');  // Correct import
const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/profile', authController.getUserData);

// Rutas POST para autenticación
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = {
                _id: user._id,
                email: user.email,
                name: user.name,
                rol: user.rol
            };
            await req.session.save(); // Asegurar que la sesión se guarde
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

router.post('/register', async (req, res) => {
    try {
        await authController.register(req, res);
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
    }
});

router.post('/recuperar-contrasena', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico es requerido'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No existe una cuenta con ese correo electrónico'
            });
        }

        // Generar contraseña temporal
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        // Actualizar contraseña en la base de datos
        user.password = hashedPassword;
        await user.save();

        const mailerSend = new MailerSend({
            apiKey: process.env.MAILERSEND_API_KEY
        });

        const sentFrom = new Sender('MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net', 'VibeTickets');
        const recipients = [new Recipient(user.email)];

        const emailData = {
            from: sentFrom,
            to: recipients,
            subject: 'Recuperación de Contraseña - VibeTickets',
            html: `
                <h1>Recuperación de Contraseña</h1>
                <p>Tu nueva contraseña temporal es: <strong>${tempPassword}</strong></p>
                <p>Por favor, cambia tu contraseña después de iniciar sesión.</p>
            `
        };

        await mailerSend.email.send(emailData);

        res.json({
            success: true,
            message: 'Se ha enviado una nueva contraseña a tu correo electrónico'
        });

    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la recuperación de contraseña'
        });
    }
});

router.get('/logout', (req, res) => {
    try {
        if (req.session) {
            // Destruir la sesión
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error al cerrar sesión:', err);
                    return res.status(500).send('Error al cerrar sesión');
                }
                
                // Limpiar la cookie de sesión
                res.clearCookie('connect.sid', {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });
                
                // Redireccionar a la página principal
                return res.status(302).redirect('/');
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).send('Error interno del servidor');
    }
});

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