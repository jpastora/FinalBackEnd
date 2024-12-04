const Ticket = require('../models/tickets');
const Orden = require('../models/orden');
const Evento = require('../models/evento');

const getMisTickets = async (req, res) => {
    try {
        const userId = req.session.user._id;
        
        // Obtener las órdenes del usuario
        const ordenes = await Orden.find({ usuario: userId })
            .populate('tickets.evento')
            .sort({ fechaCreacion: -1 });

        // Obtener los tickets individuales del usuario
        const tickets = await Ticket.find({ usuario: userId })
            .populate('evento')
            .sort({ fechaCompra: -1 });

        // Obtener lugares y categorías únicos para los filtros
        const lugares = await Evento.distinct('lugar');
        const categorias = await Evento.distinct('categoria');

        // Obtener los filtros de la query
        const filtros = {
            busqueda: req.query.busqueda || '',
            lugar: req.query.lugar || '',
            categoria: req.query.categoria || ''
        };

        res.render('user/perfilMisTickets.html', {
            tickets,
            ordenes,
            lugares,
            categorias,
            filtros
        });
    } catch (error) {
        console.error('Error al obtener tickets:', error);
        res.status(500).render('error', {
            message: 'Error al cargar los tickets'
        });
    }
};

module.exports = {
    getMisTickets,
};