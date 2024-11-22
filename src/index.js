// Importación de módulos necesarios
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');

// Configuración de middleware para procesar datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const uri = "mongodb+srv://uservibe:vive1717@cluster0.fztdd.mongodb.net/VibeTickets?retryWrites=true&w=majority";

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
connectDB(); // Mantén la conexión activa durante el ciclo de vida del servidor



// Configuración del servidor para escuchar en el puerto definido
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Servidor SMTP de Gmail
        port: 587,             // Puerto para conexiones STARTTLS
        secure: false,         // Usar STARTTLS en lugar de SSL/TLS directamente
        auth: {
        user: "joe.red.pruebas@gmail.com", // Correo electrónico
        pass: "Manomano3",       // Contraseña
    },
    tls: {
        rejectUnauthorized: false, // Permitir certificados no seguros (opcional para pruebas locales)
    },
});

module.exports = transporter;

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

// --------------------- RUTAS DE LA APLICACIÓN ---------------------

// Ruta principal
app.get('/', (req, res) => {
    res.render('inicio.html', { title: 'Inicio' });
});

// Rutas principales
app.get('/nosotros', (req, res) => {
    res.render('nosotros.html', { title: 'Nosotros' });
});

app.get('/ayuda', (req, res) => {
    res.render('ayuda.html', { title: 'Ayuda' });
});

// Rutas de autenticación
app.get('/auth/login', (req, res) => {
    res.render('auth/login.html', { title: 'Iniciar Sesión' });
});

app.get('/auth/registro', (req, res) => {
    res.render('auth/registro.html', { title: 'Registro' });
});

app.get('/auth/recuperar-contrasena', (req, res) => {
    res.render('auth/recuperarContrasena.html', { title: 'Recuperar Contraseña' });
});

// Rutas de perfil
app.get('/perfil', (req, res) => {
    res.redirect('/perfil/datos-personales');
});

app.get('/perfil/datos-personales', (req, res) => {
    res.render('user/perfilDatosPers.html', { title: 'Datos Personales' });
});

// Ruta POST para registro de usuarios
const User = require('../models/usuarios.js'); // Asegúrate de que el modelo esté configurado correctamente

app.post('/registerUser', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Crear un nuevo usuario
        const newUser = new User({
            name: req.body.name,
            secondName: req.body.secondName,
            id: req.body.id,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            rol: req.body.rol,
        });

        // Enviar correo de confirmación
        const mailOptions = {
            from: "joe.red.pruebas@gmail.com",
            to: User.email,
            subject: "Confirmación de Registro - VibeTickets",
            html: `
                <h1>Registro Exitoso</h1>
                <p>Hola, ${User.name} ${User.secondName},</p>
                <p>Tu registro se ha completado exitosamente. Gracias por unirte a nuestra plataforma.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${newUser.email}`);

        // Responder con éxito
        res.status(200).json({ message: "Registro completado con éxito" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
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
