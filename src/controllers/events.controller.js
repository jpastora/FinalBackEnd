const Evento = require('../models/eventos');

const getAllEvents = async (req, res) => {
    try {
        const eventos = await Evento.find();
        res.render('eventos.html', { 
            title: 'Eventos',
            eventos: eventos
        });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar eventos'
        });
    }
};

const createEvent = async (req, res) => {
    try {
        const nuevoEvento = new Evento({
            ...req.body,
            organizador: req.session.user.userId
        });
        await nuevoEvento.save();
        res.redirect('/eventos');
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(400).render('eventos/crearEvento.html', {
            title: 'Crear Evento',
            error: error.message
        });
    }
};

// ...más métodos del controlador según sea necesario...

module.exports = {
    getAllEvents,
    createEvent
};