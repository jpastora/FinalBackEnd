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
    // Debugging
    console.log('AuthMiddleware - Sesión:', req.session);
    
    if (req.session && req.session.user) {
        res.locals.isAuthenticated = true;
        res.locals.currentUser = req.session.user;
        res.locals.userId = req.session.user._id; // Cambiado de userId a _id
        res.locals.userRole = req.session.user.rol;
    } else {
        res.locals.isAuthenticated = false;
        res.locals.currentUser = null;
        res.locals.userId = null;
        res.locals.userRole = null;
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