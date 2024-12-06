const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const { MailerSend } = require("mailersend");
const connectDB = require('./config/database');
const mainRoutes = require('./routes/main.routes');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');
const eventsRoutes = require('./routes/events.routes');
const cartRoutes = require('./routes/cart.routes');
const { sessionConfig, authMiddleware } = require('./middleware/auth');
const { checkAuth, checkAdmin } = require('./middleware/checkAuth');
const upload = require('./middleware/upload');

const app = express();
const port = 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    ...sessionConfig,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));
app.use(authMiddleware);

// Configuración de vistas y archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads/eventos', express.static(path.join(__dirname, 'uploads/eventos'))); // Cambio aquí
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Agregar middleware para debugging de rutas
app.use((req, res, next) => {
    console.log('Ruta solicitada:', req.path);
    console.log('Vista a renderizar:', req.path.replace('.html', ''));
    next();
});

// Middleware para variables globales
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    res.locals.isAuthenticated = req.session && req.session.user ? true : false;
    res.locals.user = req.session?.user || null;
    res.locals.userRole = req.session?.user?.rol || null;
    console.log('User Role:', res.locals.userRole); // Para debugging
    next();
});

// Middleware para debugging de sesión y usuario
app.use((req, res, next) => {
    console.log('Sesión actual:', req.session);
    console.log('Usuario en sesión:', req.session.user);
    next();
});

// Middleware para debugging de sesión
app.use((req, res, next) => {
    console.log('Sesión actual:', req.session);
    console.log('Usuario autenticado:', !!req.session.user);
    next();
});

// Conexión a la base de datos
connectDB();

// Rutas públicas
app.use('/auth', authRoutes);
app.use('/eventos', eventsRoutes);
app.use('/cart', checkAuth, cartRoutes); // Rutas del carrito
app.use('/pago', checkAuth, paymentRoutes); // Rutas de pago
app.use('/perfil', checkAuth, profileRoutes); // Asegurarse que esta ruta esté antes de mainRoutes
app.use('/admin', checkAuth, checkAdmin, adminRoutes);
app.use('/', mainRoutes); // Debe ir al final

// Manejo de errores - 404
app.use((req, res) => {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.status(404).json({ 
            success: false,
            error: 'Ruta no encontrada'
        });
    } else {
        res.status(404).render('404.html', { 
            title: 'Página no encontrada',
            message: 'La página que buscas no existe'
        });
    }
});

// Manejo de errores - 500
app.use((err, req, res, next) => {
    console.error('Error detectado:', err);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
        });
    } else {
        res.status(500).render('error.html', { 
            title: 'Error del Servidor',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
        });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
    console.log('Cerrando servidor...');
    mongoose.connection.close();
    process.exit(0);
}



module.exports = app;



