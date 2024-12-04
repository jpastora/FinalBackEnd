const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const PaymentCard = require('../models/paymentCard');
const Ticket = require('../models/tickets');
const User = require('../models/user');
const Evento = require('../models/evento'); // Corregido: importación del modelo Evento
const Orden = require('../models/orden'); // Importación del modelo Orden

// Función auxiliar para obtener datos del carrito
async function getCartData(userId) {
    const cart = await Cart.findOne({ usuario: userId }).populate('items.evento');
    const cartData = cart || { items: [], total: 0 };
    const subtotal = cartData.total || 0;
    const iva = subtotal * 0.13;
    const total = subtotal + iva;
    return { cart: cartData, subtotal, iva, total };
}

router.get('/', async (req, res) => {
    try {
        const cartData = await getCartData(req.session.user._id);
        res.render('pago/pagos.html', { 
            title: 'Pago',
            ...cartData
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar el carrito'
        });
    }
});

router.get('/carrito', async (req, res) => {
    try {
        const cartData = await getCartData(req.session.user._id);
        res.render('pago/pagos.html', { 
            title: 'Carrito',
            ...cartData
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar el carrito'
        });
    }
});

router.get('/seleccion', (req, res) => {
    res.render('pago/seleccion_pago.html', { title: 'Seleccionar Pago' });
});

router.get('/resumen', (req, res) => {
    res.render('pago/resumen_compra.html', { title: 'Resumen de Compra' });
});

router.get('/confirmacion', async (req, res) => {
    try {
        const ordenId = req.query.orden;
        const tickets = await Ticket.find({ _id: { $in: ordenId.split(',') } })
            .populate('evento');

        const totalCompra = tickets.reduce((sum, ticket) => sum + ticket.precioTotal, 0);

        res.render('pago/pago_completado.html', { 
            title: 'Confirmación de Pago',
            ordenId,
            tickets,
            totalCompra
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar la confirmación'
        });
    }
});

router.get('/api/payment-cards', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        
        const cards = await PaymentCard.find({ userId: req.session.user._id })
            .select('-cvv') // Excluir datos sensibles
            .sort({ createdAt: -1 });
            
        res.json(cards);
    } catch (error) {
        console.error('Error al obtener tarjetas:', error);
        res.status(500).json({ error: 'Error al obtener las tarjetas' });
    }
});

router.post('/api/process-payment', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const cart = await Cart.findOne({ usuario: userId }).populate('items.evento');
        
        if (!cart || !cart.items.length) {
            return res.status(400).json({ error: 'Carrito vacío' });
        }

        // Verificar stock y crear array de tickets para la orden
        const ticketsOrden = [];
        let totalOrden = 0;

        for (const item of cart.items) {
            const evento = await Evento.findById(item.evento._id);
            if (!evento || evento.tickets < item.cantidad) {
                return res.status(400).json({ 
                    error: `No hay suficientes tickets para ${evento.nombre}` 
                });
            }

            const precioTotal = item.precioUnitario * item.cantidad;
            ticketsOrden.push({
                evento: item.evento._id,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                precioTotal: precioTotal
            });
            totalOrden += precioTotal;
        }

        // Crear orden
        const orden = new Orden({
            usuario: userId,
            tickets: ticketsOrden,
            total: totalOrden
        });
        await orden.save();

        // Actualizar inventario y crear tickets
        for (const item of ticketsOrden) {
            await Evento.findByIdAndUpdate(item.evento, {
                $inc: { tickets: -item.cantidad }
            });

            const ticket = new Ticket({
                evento: item.evento,
                usuario: userId,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                precioTotal: item.precioTotal,
                orden: orden._id,
                fechaCompra: new Date()
            });
            await ticket.save();
        }

        // Limpiar carrito
        await Cart.findByIdAndDelete(cart._id);

        res.json({ 
            success: true,
            message: 'Compra realizada con éxito',
            ordenId: orden._id
        });

    } catch (error) {
        console.error('Error en el proceso de pago:', error);
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
});

router.get('/api/resumen-compra', async (req, res) => {
    try {
        const cartData = await getCartData(req.session.user._id);
        res.json(cartData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el resumen' });
    }
});

router.get('/completado/:ordenId', async (req, res) => {
    try {
        const orden = await Orden.findById(req.params.ordenId)
            .populate({
                path: 'tickets.evento',
                select: 'nombre precio' // Asegurarnos de obtener el nombre y precio
            });

        if (!orden) {
            return res.redirect('/');
        }

        res.render('pago/pago_completado.html', {
            ordenId: orden._id,
            tickets: orden.tickets,
            totalCompra: orden.total,
            fecha: orden.fechaCreacion
        });
    } catch (error) {
        console.error('Error al mostrar pago completado:', error);
        res.redirect('/');
    }
});

module.exports = router;