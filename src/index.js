// Importación de módulos necesarios
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

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

// Eliminar la ruta /registerUser duplicada y mantener solo esta versión
app.post('/registerUser', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Validación básica
        if (!req.body.name || !req.body.email || !req.body.password) {
            throw new Error('Faltan campos requeridos');
        }

        const newUser = new User({
            name: req.body.name,
            secondName: req.body.secondName,
            id: req.body.id,
            email: req.body.email,
            password: req.body.password, // Considera usar bcrypt aquí
            phone: req.body.phone,
            rol: 'user'
        });

        // Guardar usuario
        const savedUser = await newUser.save();
        console.log('Usuario guardado:', savedUser);

        try {
            // Enviar correo
            const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "Vibe Tickets");
            const recipients = [new Recipient(newUser.email, newUser.name)];

            const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject("Bienvenido a Vibe Tickets - Confirmación de Registro")
                .setHtml(`
                    <h1>¡Bienvenido a Vibe Tickets!</h1>
                    <p>Hola ${newUser.name},</p>
                    <p>Tu registro ha sido exitoso. Aquí están tus datos:</p>
                    <ul>
                        <li>Nombre: ${newUser.name} ${newUser.secondName}</li>
                        <li>ID: ${newUser.id}</li>
                        <li>Email: ${newUser.email}</li>
                        <li>Teléfono: ${newUser.phone}</li>
                    </ul>
                    <p>Ya puedes iniciar sesión en nuestra plataforma.</p>
                `);

            await mailerSend.email.send(emailParams);
            console.log('Email enviado correctamente');
        } catch (emailError) {
            console.error('Error al enviar email:', emailError);
            // Continuamos aunque falle el email
        }

        res.status(200).json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });

    } catch (error) {
        console.error('Error completo:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Error al registrar usuario'
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

// Función para generar contraseña temporal
function generateTempPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Ruta para procesar la recuperación de contraseña
app.post('/recuperar-contrasena', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No existe una cuenta con este correo electrónico'
            });
        }

        // Generar nueva contraseña temporal
        const tempPassword = generateTempPassword();
        user.password = tempPassword;
        await user.save();

        // Enviar correo con la contraseña temporal
        const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "Vibe Tickets");
        const recipients = [new Recipient(user.email, user.name)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Vibe Tickets - Recuperación de Contraseña")
            .setHtml(`
                <h1>Recuperación de Contraseña</h1>
                <p>Hola ${user.name},</p>
                <p>Has solicitado recuperar tu contraseña. Tu nueva contraseña temporal es:</p>
                <h2>${tempPassword}</h2>
                <p>Por favor, inicia sesión con esta contraseña y cámbiala inmediatamente por motivos de seguridad.</p>
                <p>Si no solicitaste este cambio, por favor contacta con soporte inmediatamente.</p>
                <p>Saludos,<br>Equipo de Vibe Tickets</p>
            `);

        await mailerSend.email.send(emailParams);

        res.status(200).json({
            success: true,
            message: 'Se ha enviado una nueva contraseña a tu correo electrónico'
        });

    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar la solicitud'
        });
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

// Configuración de MailerSend
const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY || 'mlsn.63a3c27299ea23c6376b823107554664a07911864ad75b64217aea286416da4c'
});

// Función para enviar email de confirmación
async function sendConfirmationEmail(user) {
    try {
        const sentFrom = new Sender("MS_9LuM3X@trial-351ndgwe0kqgzqx8.mlsender.net", "Vibe Tickets");
        const recipients = [new Recipient(user.email, user.name)];

        const htmlContent = `
            <h1>¡Bienvenido a Vibe Tickets!</h1>
            <p>Hola ${user.name},</p>
            <p>Tu registro ha sido exitoso. Aquí están tus datos:</p>
            <ul>
                <li>Nombre: ${user.name} ${user.secondName}</li>
                <li>ID: ${user.id}</li>
                <li>Email: ${user.email}</li>
                <li>Teléfono: ${user.phone}</li>
            </ul>
            <p>Ya puedes iniciar sesión en nuestra plataforma.</p>
            <p>¡Gracias por unirte a nosotros!</p>
        `;

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Bienvenido a Vibe Tickets - Confirmación de Registro")
            .setHtml(htmlContent);

        const response = await mailerSend.email.send(emailParams);
        console.log("Email de confirmación enviado:", response);
        return true;
    } catch (error) {
        console.error("Error enviando email:", error);
        return false;
    }
}
