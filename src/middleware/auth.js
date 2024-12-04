const session = require('express-session');
const User = require('../models/user');

const sessionConfig = {
    secret: 'secreto-seguro-aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
};

const authMiddleware = (req, res, next) => {
    // Configurar variables locales para las vistas
    res.locals.isAuthenticated = req.session && req.session.user ? true : false;
    res.locals.currentUser = req.session.user || null;
    
    // Configurar rol de usuario
    if (req.session && req.session.user) {
        res.locals.userId = req.session.user.userId;
        res.locals.userRole = req.session.user.rol;
    } else {
        res.locals.userId = null;
        res.locals.userRole = null;
    }

    // Guardar URL original para redirección post-login
    if (!req.session.user && !req.path.startsWith('/auth')) {
        req.session.returnTo = req.originalUrl;
    }

    next();
};


// Function to check authentication and roles
function checkAuth(req, res, next) {
    const user = req.user; // Assuming user information is stored in req.user

    if (!user) {
        return res.redirect('/login');
    }

    if (user.role === 'admin') {
        return res.redirect('/admin-dashboard');
    } else if (user.role === 'user') {
        return res.redirect('/user-dashboard');
    } else {
        return res.status(403).send('Access Denied');
    }
}

const checkUserRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.rol === role) {
            return next();
        }
        res.status(403).render('error.html', { 
            title: 'Acceso Denegado',
            message: 'No tienes permisos para acceder a esta área'
        });
    };
};

module.exports = {
    sessionConfig,
    authMiddleware,
    checkAuth,
    checkUserRole
};