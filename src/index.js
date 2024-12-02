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
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para variables globales
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    res.locals.isAuthenticated = req.session && req.session.user ? true : false;
    res.locals.userId = req.session?.user?.userId || null;
    res.locals.userRole = req.session?.user?.rol || null;
    next();
});

// Conexión a la base de datos
connectDB();

// Rutas públicas
app.use('/', mainRoutes);
app.use('/auth', authRoutes);      // Rutas de autenticación después
app.use('/eventos', eventsRoutes); // Otras rutas después

// Rutas protegidas
app.use('/perfil', checkAuth, profileRoutes);
app.use('/admin', checkAuth, checkAdmin, adminRoutes);
app.use('/pago', checkAuth, paymentRoutes);

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