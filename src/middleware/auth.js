
const session = require('express-session');

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

module.exports = {
    sessionConfig,
    authMiddleware
};