const User = require('../models/user');
const { sendConfirmationEmail, sendPasswordResetEmail } = require('../config/mailer');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Datos recibidos en el servidor:', { email, password });

        if (!email || !password) {
            console.log('Faltan campos requeridos');
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('Usuario encontrado:', user ? 'Sí' : 'No');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Contraseña válida:', isValidPassword ? 'Sí' : 'No');

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        req.session.user = {
            userId: user._id,
            email: user.email,
            rol: user.rol
        };
        console.log('Sesión creada:', req.session.user);

        return res.json({
            success: true,
            message: 'Login exitoso'
        });
    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

const register = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            throw new Error('Faltan campos requeridos');
        }

        const newUser = new User({
            name: req.body.name,
            secondName: req.body.secondName,
            id: req.body.id,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            rol: 'user'
        });

        const savedUser = await newUser.save();
        await sendConfirmationEmail(savedUser);

        res.status(200).json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Error al registrar usuario'
        });
    }
};

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No existe una cuenta con este correo electrónico'
            });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        user.password = hashedPassword;
        await user.save();

        const emailSent = await sendPasswordResetEmail(user, tempPassword);

        if (!emailSent) {
            throw new Error('Error al enviar el correo');
        }

        return res.json({
            success: true,
            message: 'Se ha enviado una nueva contraseña a tu correo electrónico'
        });
    } catch (error) {
        console.error('Error en recuperación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud'
        });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

module.exports = {
    login,
    register,
    recoverPassword,
    logout
};