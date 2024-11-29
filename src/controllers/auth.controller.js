const User = require('../models/usuarios');
const { sendConfirmationEmail } = require('../config/mailer');
const { generateTempPassword } = require('../utils/helpers');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intentando login con:', { email });

        if (!email || !password) {
            return res.render('auth/login.html', {
                title: 'Iniciar Sesión',
                error: 'Email y contraseña son requeridos'
            });
        }

        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.render('auth/login.html', {
                title: 'Iniciar Sesión',
                error: 'Usuario no encontrado'
            });
        }

        if (password === user.password) {
            req.session.user = {
                userId: user._id,
                email: user.email,
                rol: user.rol
            };
            return res.redirect('/');
        } else {
            return res.render('auth/login.html', {
                title: 'Iniciar Sesión',
                error: 'Email o contraseña incorrectos'
            });
        }
    } catch (err) {
        console.error('Error en login:', err);
        return res.render('auth/login.html', {
            title: 'Iniciar Sesión',
            error: 'Error interno del servidor'
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
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No existe una cuenta con este correo electrónico'
            });
        }

        const tempPassword = generateTempPassword();
        user.password = tempPassword;
        await user.save();

        const emailSent = await sendConfirmationEmail({
            ...user.toObject(),
            tempPassword
        });

        if (!emailSent) {
            throw new Error('Error al enviar el correo');
        }

        res.status(200).json({
            success: true,
            message: 'Se ha enviado una nueva contraseña a tu correo electrónico'
        });
    } catch (error) {
        console.error('Error en recuperación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar la solicitud'
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