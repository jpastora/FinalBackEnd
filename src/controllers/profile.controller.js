const Ticket = require('../models/tickets');

const getMisTickets = async (req, res) => {
    try {
        const { busqueda, lugar, categoria } = req.query;
        let query = { usuario: req.session.user.userId };

        // Obtener categorías y lugares únicos para el select
        const uniqueCategories = await Ticket.distinct('evento.categoria').populate('evento');
        const uniquePlaces = await Ticket.distinct('evento.lugar').populate('evento');

        let tickets = await Ticket.find(query).populate({
            path: 'evento',
            select: 'nombre lugar fecha hora categoria'
        });

        // Aplicar filtros
        if (busqueda) {
            tickets = tickets.filter(ticket => 
                ticket.evento.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }
        if (lugar && lugar !== 'disabled selected') {
            tickets = tickets.filter(ticket => ticket.evento.lugar === lugar);
        }
        if (categoria && categoria !== 'disabled selected') {
            tickets = tickets.filter(ticket => ticket.evento.categoria === categoria);
        }

        res.render('user/perfilMisTickets.html', { 
            tickets,
            categorias: uniqueCategories,
            lugares: uniquePlaces,
            filtros: { busqueda, lugar, categoria }
        });

    } catch (error) {
        console.error('Error al obtener tickets:', error);
        res.status(500).send('Error al obtener los tickets');
    }
};

module.exports = {
    getMisTickets,
};