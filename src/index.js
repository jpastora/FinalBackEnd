const express = require('express');
const path = require('path');
const app = express();

const port = 3000;

// Configurar servidor para escuchar en el puerto definido
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
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

app.get('/perfil/mis-tickets', (req, res) => { // Corregido aquí
    res.render('user/perfilMisTickets.html', { title: 'Mis Tickets' });
});




// ------------------- Rutas de pago -------------------

app.get('/pago/seleccion', (req, res) => {
    res.render('seleccion_pago.html', { title: 'Seleccionar Pago' });
});

app.get('/pago/carrito', (req, res) => {
    res.render('pagos.html', { title: 'Carrito' });
});

app.get('/pago/resumen', (req, res) => {
    res.render('resumen_compra.html', { title: 'Resumen de Compra' });
});

app.get('/pago/confirmacion', (req, res) => {
    res.render('pago_completado.html', { title: 'Confirmación de Pago' });
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

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('404.html', { title: 'Página no encontrada' });
});
