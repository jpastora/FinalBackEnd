const Ticket = require('../models/tickets');
const Evento = require('../models/eventos');

const processPayment = async (req, res) => {
    try {
        const { eventoId, cantidad } = req.body;
        const evento = await Evento.findById(eventoId);
        
        if (!evento) {
            throw new Error('Evento no encontrado');
        }

        const ticket = new Ticket({
            evento: eventoId,
            usuario: req.session.user.userId,
            cantidad: cantidad,
            precioTotal: evento.precio * cantidad
        });

        await ticket.save();
        
        res.redirect('/pago/confirmacion');
    } catch (error) {
        console.error('Error en el proceso de pago:', error);
        res.status(500).render('error.html', {
            title: 'Error en el Pago',
            message: error.message
        });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const tickets = await Ticket.find({ usuario: req.session.user.userId })
            .populate('evento')
            .sort({ fechaCompra: -1 });

        res.render('user/perfilMisTickets.html', {
            title: 'Mis Tickets',
            tickets: tickets
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar el historial de tickets'
        });
    }
};

module.exports = {
    processPayment,
    getPaymentHistory
};