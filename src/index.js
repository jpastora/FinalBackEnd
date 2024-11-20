const express = require('express');
const path = require('path');
const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//Directorio de elementos estaticos
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

//Motor de plantillas
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname + '/views'));


// Rutas principales
app.get('/', (req, res) => {
    res.render('inicio.html');
});

// Ruta para la página de nosotros
app.get('/nosotros', (req, res) => {
    res.render('nosotros.html');
});

// Ruta para la página de ayuda
app.get('/ayuda', (req, res) => {
    res.render('ayuda.html');
});

// Rutas de eventos
app.get('/eventos', (req, res) => {
    res.render('eventos.html');
});

app.get('/eventos/crear', (req, res) => {
    res.render('eventos/crearEvento.html');
});

app.get('/eventos/editar', (req, res) => {
    res.render('eventos/editarEventos.html');
});

app.get('/eventos/evento', (_, res) => {
    res.render('eventos/evento.html');
});

app.get('/eventos/evento2', (req, res) => {
    res.render('eventos/evento2.html');
});

// Rutas de autenticación
app.get('/auth/login', (req, res) => {
    res.render('auth/login.html');
});

app.get('/auth/registro', (req, res) => {
    res.render('auth/registro.html');
});

// Rutas de categorías
app.get('/eventos/categorias', (req, res) => {
    res.render('eventos/categorias.html');
});

// Rutas de perfil
app.get('/perfil/datospersonales', (req, res) => {
    res.render('user/perfilDatosPers.html');
});

// Rutas de pago
app.get('/pago/seleccion', (req, res) => {
    res.render('seleccion_pago.html');
});

app.get('/pago/carrito', (req, res) => {
    res.render('pagos.html');
});

app.get('/pago/resumen', (req, res) => {
    res.render('resumen_compra.html');
});

app.get('/pago/confirmacion', (req, res) => {
    res.render('pago_completado.html');
});

// Rutas de administrador
app.get('/admin', (req, res) => {
    res.render('admin/adminDatosPers.html');
});

app.get('/admin/datos-personales', (req, res) => {
    res.render('admin/adminDatosPers.html');
});


app.get('/admin/seguridad', (req, res) => {
    res.render('admin/adminSeguridad.html');
});

app.get('/admin/metodos-pago', (req, res) => {
    res.render('admin/adminMetodosPago.html');
});


app.get('/admin/usuarios', (req, res) => {
    res.render('admin/administrarUsuarios.html');
});

app.get('/admin/eventos', (req, res) => {
    res.render('admin/adminEventos.html');
});

app.get('/admin/editar-evento', (req, res) => {
    res.render('admin/admineditarEventos.html');
});

app.get('/admin/crear-evento', (req, res) => {
    res.render('admin/adminCrearEventos.html');
});