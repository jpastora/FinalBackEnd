const Ticket = require('../models/tickets');
const Orden = require('../models/orden');
const Evento = require('../models/evento');

const getMisTickets = async (req, res) => {
    try {
        // Parámetros de paginación
        const ordenesPage = parseInt(req.query.ordenesPage) || 1;
        const ticketsPage = parseInt(req.query.ticketsPage) || 1;
        const limit = 5;

        const userId = req.session.user._id;

        // Obtener total de documentos para la paginación
        const totalOrdenes = await Orden.countDocuments({ usuario: userId });
        const totalTickets = await Ticket.countDocuments({ usuario: userId });

        // Calcular páginas totales
        const totalOrdenesPages = Math.ceil(totalOrdenes / limit);
        const totalTicketsPages = Math.ceil(totalTickets / limit);

        // Obtener órdenes paginadas
        const ordenes = await Orden.find({ usuario: userId })
            .populate('tickets.evento')
            .skip((ordenesPage - 1) * limit)
            .limit(limit)
            .sort({ fechaCreacion: -1 });

        // Obtener tickets paginados
        const tickets = await Ticket.find({ usuario: userId })
            .populate('evento')
            .skip((ticketsPage - 1) * limit)
            .limit(limit)
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
            filtros,
            ordenesPage,
            ticketsPage,
            totalOrdenesPages,
            totalTicketsPages
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