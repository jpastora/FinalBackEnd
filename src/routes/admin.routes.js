const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');
const userController = require('../controllers/user.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/profiles/' });
const { checkUserRole } = require('../middleware/auth');

// Asegurarse que esta ruta esté antes de las rutas con parámetros
router.get('/eventos/listar', eventoController.listarEventosAdmin);

router.get('/eventos/:id', eventoController.obtenerEventoPorId);
router.delete('/eventos/:id', eventoController.eliminarEvento);

// Rutas protegidas con verificación de rol de administrador
router.get('/', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminDatosPers', { title: 'Datos Personales' });
});

router.get('/datos-personales', checkUserRole('admin'), async (req, res) => {
    try {
        const userData = req.session.user || null;
        res.render('admin/adminDatosPers', { 
            title: 'Datos Personales',
            userData: userData
        });
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error al cargar los datos personales'
        });
    }
});

router.get('/seguridad', (req, res) => {
    res.render('admin/adminSeguridad.html', { title: 'Seguridad' });
});

router.get('/metodos-pago', (req, res) => {
    res.render('admin/adminMetodosPago.html', { title: 'Métodos de Pago' });
});

router.get('/usuarios', checkUserRole('admin'), (req, res) => {
    res.render('admin/administrarUsuarios', { title: 'Administrar Usuarios' });
});

router.get('/eventos', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminEventos', { title: 'Administrar Eventos' });
});

router.get('/editar-evento', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminEditarEventos.html', { title: 'Editar Evento' });
});

router.get('/crear-evento', checkUserRole('admin'), (req, res) => {
    res.render('admin/adminCrearEvento.html', { title: 'Crear Evento' });
});

// API routes for user management
router.get('/api/users', userController.getAllUsers);
router.get('/api/users/:id', userController.getUser);
router.put('/api/users/:id', upload.single('profileImage'), userController.updateUser);
router.delete('/api/users/:id', userController.deleteUser);

module.exports = router;