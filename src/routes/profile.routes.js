const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = require('../middleware/upload');
const bcrypt = require('bcrypt');
const PaymentCard = require('../models/paymentCard');
const profileController = require('../controllers/profile.controller');
const { isAuth } = require('../middleware/checkAuth'); // Agregar esta línea
const EventoGuardado = require('../models/eventoGuardado'); // Agregar esta línea

router.get('/', (req, res) => {
    res.redirect('/perfil/datos-personales');
});

router.get('/datos-personales', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) { // Cambiado de userId a _id
            return res.redirect('/auth/login');
        }

        const user = await User.findById(req.session.user._id); // Cambiado de userId a _id
        if (!user) {
            return res.status(404).render('error.html', {
                title: 'Error',
                message: 'Usuario no encontrado'
            });
        }

        res.render('user/perfilDatosPers.html', {
            title: 'Datos Personales',
            userData: {
                name: user.name,
                email: user.email,
                id: user.id,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar datos de usuario'
        });
    }
});

router.post('/actualizar-perfil', upload.profiles.single('perfilImg'), async (req, res) => {
    try {
        const { nombre, email, cedula } = req.body;
        const userId = req.session.user._id; // Cambiado de userId a _id

        const updateData = {
            name: nombre,
            email: email,
            id: cedula
        };

        if (req.file) {
            updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        await User.findByIdAndUpdate(userId, updateData);

        res.json({ success: true, message: 'Perfil actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar perfil' 
        });
    }
});

router.post('/actualizar-contrasena', async (req, res) => {
    try {
        const { antiguaContrasena, nuevaContrasena, repetirContrasena } = req.body;
        const userId = req.session.user._id;

        // Verificar que las contraseñas nuevas coincidan
        if (nuevaContrasena !== repetirContrasena) {
            return res.json({ 
                success: false, 
                message: 'Las contraseñas no coinciden' 
            });
        }

        // Obtener usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        // Verificar contraseña antigua
        const isValidPassword = await bcrypt.compare(antiguaContrasena, user.password);
        if (!isValidPassword) {
            return res.json({ 
                success: false, 
                message: 'La contraseña actual es incorrecta' 
            });
        }

        // Encriptar nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
        
        // Actualizar contraseña
        await User.findByIdAndUpdate(userId, { 
            password: hashedPassword 
        });

        res.json({ 
            success: true, 
            message: 'Contraseña actualizada correctamente' 
        });
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar la contraseña' 
        });
    }
});

router.get('/seguridad', (req, res) => {
    res.render('user/perfilSeguridad.html', { title: 'Seguridad' });
});

router.get('/metodospago', async (req, res) => {
    try {
        const cards = await PaymentCard.find({ userId: req.session.user._id });
        res.render('user/perfilMetodosPago.html', { 
            title: 'Métodos de Pago',
            cards: cards
        });
    } catch (error) {
        res.status(500).render('error.html', { message: error.message });
    }
});

router.post('/metodospago/agregar', async (req, res) => {
    try {
        const { cardholderName, cardNumber, expirationDate, cvv } = req.body;
        const newCard = new PaymentCard({
            userId: req.session.user._id,
            cardholderName,
            cardNumber,
            expirationDate,
            cvv
        });
        await newCard.save();
        res.json({ success: true, message: 'Tarjeta agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/metodospago/:cardId', async (req, res) => {
    try {
        await PaymentCard.findOneAndDelete({
            _id: req.params.cardId,
            userId: req.session.user._id
        });
        res.json({ success: true, message: 'Tarjeta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/eventos-guardados', isAuth, async (req, res) => {
    try {
        const userId = req.session.user._id;
        
        // Obtener eventos guardados de ambas fuentes
        const [eventosGuardadosModelo, user] = await Promise.all([
            EventoGuardado.find({ userId }).populate('eventoId'),
            User.findById(userId).populate('eventosGuardados')
        ]);

        // Combinar eventos de ambas fuentes
        const eventosFromGuardados = eventosGuardadosModelo
            .filter(eg => eg.eventoId)
            .map(eg => eg.eventoId);
        
        const eventosFromUser = user.eventosGuardados || [];
        
        // Combinar y eliminar duplicados
        const todosEventos = [...new Set([...eventosFromGuardados, ...eventosFromUser])];

        // Formatear los eventos
        const eventosFormateados = todosEventos.map(evento => ({
            _id: evento._id,
            nombre: evento.nombre,
            imagen: evento.imagen,
            lugar: evento.lugar,
            precio: evento.precio,
            fechaFormateada: new Date(evento.fecha).toLocaleDateString('es-ES'),
            horaFormateada: evento.hora
        }));

        console.log('Eventos encontrados:', eventosFormateados); // Debug

        res.render('user/perfilEventosGuardados.html', {
            title: 'Eventos Guardados',
            eventos: eventosFormateados,
            query: req.query
        });
    } catch (error) {
        console.error('Error al cargar eventos guardados:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar los eventos guardados'
        });
    }
});

router.get('/mis-tickets', profileController.getMisTickets);

module.exports = router;