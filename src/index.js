// Importación de módulos necesarios
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


// Configuración de Express
const app = express();

// Configuración de variables de entorno
const port = 3000;

// Configuración de middleware para procesar datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const uri = "mongodb+srv://uservibe:vive1717@cluster0.fztdd.mongodb.net/VibeTickets?retryWrites=true&w=majority"; //no tocar

async function connectDB() {
    try {
        await mongoose.connect(uri, {
        });
        console.log("Conectado exitosamente a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
}
connectDB();

// Configuración de sesiones
app.use(session({
    secret: 'secreto-seguro-aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true en producción con HTTPS
}));

// Configuración del servidor para escuchar en el puerto definido
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/** Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Servidor SMTP de Gmail
        port: 587,             // Puerto para conexiones STARTTLS
        secure: false,         // Usar STARTTLS en lugar de SSL/TLS directamente
        auth: {
        user: "joe.red.pruebas@gmail.com", // Correo electrónico
        pass: "Manomano3",      
    },
    tls: {
        rejectUnauthorized: false, // Permitir certificados no seguros (opcional para pruebas locales)
    },
});

module.exports = transporter; */

// Configuración de sesiones
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session && req.session.user ? true : false;
    if (req.session && req.session.user) {
        res.locals.userId = req.session.user.userId;
    } else {
        res.locals.userId = null;
    }
    next();
});

// Configuración de archivos estáticos y motor de plantillas
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); // Usa EJS para archivos .html
app.set('views', path.join(__dirname, 'views'));

// Middleware para pasar la URL actual a las vistas
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});

// ------------------- Rutas principales -------------------

app.get('/', (req, res) => {
    res.render('inicio.html', { title: 'Inicio' });
});

app.get('/nosotros', (req, res) => {
    res.render('nosotros.html', { title: 'Nosotros' });
});

app.get('/ayuda', (req, res) => {
    res.render('ayuda.html', { title: 'Ayuda' });
});

// ------------------- Rutas de eventos -------------------

app.get('/eventos', (req, res) => {
    res.render('eventos.html', { title: 'Eventos' });
});

app.get('/eventos/crear', (req, res) => {
    res.render('eventos/crearEvento.html', { title: 'Crear Evento' });
});

app.get('/eventos/editar', (req, res) => {
    res.render('eventos/editarEventos.html', { title: 'Editar Eventos' });
});

app.get('/eventos/evento', (req, res) => {
    res.render('eventos/evento.html', { title: 'Evento' });
});

app.get('/eventos/evento2', (req, res) => {
    res.render('eventos/evento2.html', { title: 'Evento 2' });
});

app.get('/eventos/categorias', (req, res) => {
    res.render('eventos/categorias.html', { title: 'Categorías' });
});

// ------------------- Rutas de autenticación -------------------

app.get('/auth/login', (req, res) => {
    res.render('auth/login.html', { title: 'Iniciar Sesión' });
});

app.get('/auth/registro', (req, res) => {
    res.render('auth/registro.html', { title: 'Registro' });
});

app.get('/auth/recuperar-contrasena', (req, res) => {
    res.render('auth/recuperarContrasena.html', { title: 'Recuperar Contraseña' });
});

// ------------------- Rutas de perfil -------------------

app.get('/perfil', (req, res) => {
    res.redirect('/perfil/datos-personales');
});

app.get('/perfil/datos-personales', (req, res) => {
    res.render('user/perfilDatosPers.html', { title: 'Datos Personales' });
});

app.get('/perfil/seguridad', (req, res) => {
    res.render('user/perfilSeguridad.html', { title: 'Seguridad' });
});

app.get('/perfil/metodospago', (req, res) => {
    res.render('user/perfilMetodosPago.html', { title: 'Métodos de Pago' });
});

app.get('/perfil/eventos-guardados', (req, res) => {
    res.render('user/perfilEventosGuardados.html', { title: 'Eventos Guardados' });
});

app.get('/perfil/mis-tickets', (req, res) => { 
    res.render('user/perfilMisTickets.html', { title: 'Mis Tickets' });
});




// ------------------- Rutas de pago -------------------

app.get('/pago', (req, res) => {
    res.render('pago/pagos.html', { title: 'Pago' });
});

app.get('/pago/carrito', (req, res) => {
    res.render('pago/pagos.html', { title: 'Carrito' });
});

app.get('/pago/seleccion', (req, res) => {
    res.render('pago/seleccion_pago.html', { title: 'Seleccionar Pago' });
});

app.get('/pago/resumen', (req, res) => {
    res.render('pago/resumen_compra.html', { title: 'Resumen de Compra' });
});

app.get('/pago/confirmacion', (req, res) => {
    res.render('pago/pago_completado.html', { title: 'Confirmación de Pago' });
});

// ------------------- Rutas de administrador -------------------

app.get('/admin', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

app.get('/admin/datos-personales', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

app.get('/admin/seguridad', (req, res) => {
    res.render('admin/adminSeguridad.html', { title: 'Seguridad' });
});

app.get('/admin/metodos-pago', (req, res) => {
    res.render('admin/adminMetodosPago.html', { title: 'Métodos de Pago' });
});

app.get('/admin/usuarios', (req, res) => {
    res.render('admin/administrarUsuarios.html', { title: 'Administrar Usuarios' });
});

app.get('/admin/eventos', (req, res) => {
    res.render('admin/adminEventos.html', { title: 'Administrar Eventos' });
});

app.get('/admin/editar-evento', (req, res) => {
    res.render('admin/adminEditarEventos.html', { title: 'Editar Evento' });
});

app.get('/admin/crear-evento', (req, res) => {
    res.render('admin/adminCrearEvento.html', { title: 'Crear Evento' });
});

// Ruta POST para registro de usuarios
const User = require('../models/usuarios'); // Actualiza esta ruta según tu estructura

app.post('/registerUser', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        const newUser = new User({
            name: req.body.name,
            secondName: req.body.secondName,
            id: req.body.id,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            rol: req.body.rol || 'user', // valor por defecto
        });

        await newUser.save();
        console.log('Usuario registrado exitosamente');
        res.status(200).json({ 
            success: true, 
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error al guardar el usuario:', error.message);
        res.status(400).json({ 
            success: false, 
            error: 'Error al registrar usuario: ' + error.message 
        });
    }
});

// Modificar la ruta de login
app.post('/login', async (req, res) => {
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
        console.log('Usuario encontrado:', user);

        if (!user) {
            return res.render('auth/login.html', {
                title: 'Iniciar Sesión',
                error: 'Usuario no encontrado'
            });
        }

        // Comparación directa de contraseñas (temporal para pruebas)
        if (password === user.password) {
            req.session.user = {
                userId: user._id,
                email: user.email,
                rol: user.rol
            };
            
            console.log('Sesión creada:', req.session.user);
            return res.redirect('/'); // Redirección al inicio en caso de éxito
        } else {
            console.log('Contraseña incorrecta');
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
});
// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// ------------------- MANEJO DE ERRORES -------------------

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).render('404.html', { title: 'Página no encontrada' });
});

// Middleware global para manejo de errores (500)
app.use((err, req, res, next) => {
    console.error('Error detectado:', err.stack);
    res.status(500).send('Ocurrió un error en el servidor');
});
