// Importación de módulos necesarios
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Mantener esta declaración
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Configuración de middleware para procesar datos de formularios
// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración básica del servidor
// Conexión a la base de datos
require('../models/usuarios.js');

// Configurar el servidor para escuchar en el puerto definido
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Configuración de archivos estáticos y motor de plantillas
// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del motor de plantillas
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Middleware para pasar la URL actual a las vistas
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});

// --------------------- RUTAS DE LA APLICACIÓN ---------------------

// 1. RUTAS PRINCIPALES
// Manejo de páginas básicas como inicio, nosotros y ayuda
// ------------------- Rutas principales -------------------

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.render('inicio.html', { title: 'Inicio' });
});

// Ruta para la página "Nosotros"
app.get('/nosotros', (req, res) => {
    res.render('nosotros.html', { title: 'Nosotros' });
});

// Ruta para la página de ayuda
app.get('/ayuda', (req, res) => {
    res.render('ayuda.html', { title: 'Ayuda' });
});

// 2. RUTAS DE EVENTOS
// Gestión de todas las páginas relacionadas con eventos
// Incluye listado, creación, edición y visualización de eventos
// ------------------- Rutas de eventos -------------------

// Ruta para la página de eventos
app.get('/eventos', (req, res) => {
    res.render('eventos.html', { title: 'Eventos' });
});

// Ruta para la página de creación de eventos
app.get('/eventos/crear', (req, res) => {
    res.render('eventos/crearEvento.html', { title: 'Crear Evento' });
});

// Ruta para la página de edición de eventos
app.get('/eventos/editar', (req, res) => {
    res.render('eventos/editarEventos.html', { title: 'Editar Eventos' });
});

// Ruta para la página de un evento específico
app.get('/eventos/evento', (req, res) => {
    res.render('eventos/evento.html', { title: 'Evento' });
});

// Ruta para la página de un segundo evento específico
app.get('/eventos/evento2', (req, res) => {
    res.render('eventos/evento2.html', { title: 'Evento 2' });
});

// Ruta para la página de categorías de eventos
app.get('/eventos/categorias', (req, res) => {
    res.render('eventos/categorias.html', { title: 'Categorías' });
});

// 3. RUTAS DE AUTENTICACIÓN
// Manejo de login, registro y recuperación de contraseña
// ------------------- Rutas de autenticación -------------------

// Ruta para la página de inicio de sesión
app.get('/auth/login', (req, res) => {
    res.render('auth/login.html', { title: 'Iniciar Sesión' });
});

// Ruta para la página de registro
app.get('/auth/registro', (req, res) => {
    res.render('auth/registro.html', { title: 'Registro' });
});

// Ruta para la página de recuperación de contraseña
app.get('/auth/recuperar-contrasena', (req, res) => {
    res.render('auth/recuperarContrasena.html', { title: 'Recuperar Contraseña' });
});

// 4. RUTAS DE PERFIL DE USUARIO
// Gestión del perfil de usuario incluyendo datos personales,
// seguridad, métodos de pago y gestión de tickets
// ------------------- Rutas de perfil -------------------

// Ruta para redirigir a la página de datos personales del perfil
app.get('/perfil', (req, res) => {
    res.redirect('/perfil/datos-personales');
});

// Ruta para la página de datos personales del perfil
app.get('/perfil/datos-personales', (req, res) => {
    res.render('user/perfilDatosPers.html', { title: 'Datos Personales' });
});

// Ruta para la página de seguridad del perfil
app.get('/perfil/seguridad', (req, res) => {
    res.render('user/perfilSeguridad.html', { title: 'Seguridad' });
});

// Ruta para la página de métodos de pago del perfil
app.get('/perfil/metodospago', (req, res) => {
    res.render('user/perfilMetodosPago.html', { title: 'Métodos de Pago' });
});

// Ruta para la página de eventos guardados del perfil
app.get('/perfil/eventos-guardados', (req, res) => {
    res.render('user/perfilEventosGuardados.html', { title: 'Eventos Guardados' });
});

// Ruta para la página de mis tickets del perfil
app.get('/perfil/mis-tickets', (req, res) => {
    res.render('user/perfilMisTickets.html', { title: 'Mis Tickets' });
});

// 5. RUTAS DE PROCESO DE PAGO
// Manejo del flujo de pago completo desde carrito hasta confirmación
// ------------------- Rutas de pago -------------------

// Ruta para la página de pago
app.get('/pago', (req, res) => {
    res.render('pago/pagos.html', { title: 'Pago' });
});

// Ruta para la página del carrito de pago
app.get('/pago/carrito', (req, res) => {
    res.render('pago/pagos.html', { title: 'Carrito' });
});

// Ruta para la página de selección de pago
app.get('/pago/seleccion', (req, res) => {
    res.render('pago/seleccion_pago.html', { title: 'Seleccionar Pago' });
});

// Ruta para la página de resumen de compra
app.get('/pago/resumen', (req, res) => {
    res.render('pago/resumen_compra.html', { title: 'Resumen de Compra' });
});

// Ruta para la página de confirmación de pago
app.get('/pago/confirmacion', (req, res) => {
    res.render('pago/pago_completado.html', { title: 'Confirmación de Pago' });
});

// 6. RUTAS DE ADMINISTRADOR
// Panel de control administrativo para gestión de usuarios y eventos
// ------------------- Rutas de administrador -------------------

// Ruta para la página de datos personales del administrador
app.get('/admin', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

// Ruta para la página de datos personales del administrador
app.get('/admin/datos-personales', (req, res) => {
    res.render('admin/adminDatosPers.html', { title: 'Datos Personales' });
});

// Ruta para la página de seguridad del administrador
app.get('/admin/seguridad', (req, res) => {
    res.render('admin/adminSeguridad.html', { title: 'Seguridad' });
});

// Ruta para la página de métodos de pago del administrador
app.get('/admin/metodos-pago', (req, res) => {
    res.render('admin/adminMetodosPago.html', { title: 'Métodos de Pago' });
});

// Ruta para la página de administración de usuarios
app.get('/admin/usuarios', (req, res) => {
    res.render('admin/administrarUsuarios.html', { title: 'Administrar Usuarios' });
});

// Ruta para la página de administración de eventos
app.get('/admin/eventos', (req, res) => {
    res.render('admin/adminEventos.html', { title: 'Administrar Eventos' });
});

// Ruta para la página de edición de eventos del administrador
app.get('/admin/editar-evento', (req, res) => {
    res.render('admin/adminEditarEventos.html', { title: 'Editar Evento' });
});

// Ruta para la página de creación de eventos del administrador
app.get('/admin/crear-evento', (req, res) => {
    res.render('admin/adminCrearEvento.html', { title: 'Crear Evento' });
});

// 7. MANEJO DE ERRORES
// Páginas no encontradas (404) y errores del servidor (500)
// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('404.html', { title: 'Página no encontrada' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 8. RUTAS DE API
// Endpoints para operaciones con la base de datos
// Ruta para el registro de usuarios (POST)
app.post('/registerUser', (req, res) => {
    console.log('Registrando usuario...');
    const Usuario = require('../models/usuarios.js'); 
    let data = new Usuario({
        nombre: req.body.nombre,
        cedula: req.body.cedula,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        telefono: req.body.telefono
    });

    data.save()
        .then(() => {
            console.log('Usuario registrado');
            res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/auth/registro'); // Redirigir a la página de registro
        });
});

