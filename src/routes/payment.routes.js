const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const PaymentCard = require('../models/paymentCard');
const Ticket = require('../models/tickets');
const User = require('../models/user');
const Evento = require('../models/evento'); // Corregido: importación del modelo Evento

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
        const { tarjetaId, usarTarjetaGuardada } = req.body;
        const userId = req.session.user._id;

        const cart = await Cart.findOne({ usuario: userId }).populate('items.evento');
        if (!cart || !cart.items.length) {
            return res.status(400).json({ error: 'Carrito vacío' });
        }

        // Verificar stock actualizado
        for (const item of cart.items) {
            const evento = await Evento.findById(item.evento._id);
            if (!evento) {
                return res.status(404).json({ error: `Evento no encontrado: ${item.evento.nombre}` });
            }
            if (evento.tickets < item.cantidad) {
                return res.status(400).json({ 
                    error: `No hay suficientes tickets para ${evento.nombre}` 
                });
            }
        }

        // Crear tickets y actualizar inventario
        const ticketsCreados = [];
        for (const item of cart.items) {
            const precioTotal = item.precioUnitario * item.cantidad;
            
            const ticket = new Ticket({
                evento: item.evento._id,
                usuario: userId,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                precioTotal: precioTotal, // Agregado el precio total
                fechaCompra: new Date()
            });
            
            await ticket.save();
            ticketsCreados.push(ticket._id);

            // Actualizar stock
            await Evento.findByIdAndUpdate(item.evento._id, {
                $inc: { tickets: -item.cantidad }
            });
        }

        // Actualizar usuario y limpiar carrito
        await User.findByIdAndUpdate(userId, {
            $push: { tickets: { $each: ticketsCreados } }
        });
        
        await Cart.findByIdAndDelete(cart._id);

        res.json({ 
            success: true,
            message: 'Compra realizada con éxito',
            tickets: ticketsCreados
        });

    } catch (error) {
        console.error('Error en el proceso de pago:', error);
        res.status(500).json({ 
            error: 'Error al procesar el pago',
            details: error.message 
        });
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

module.exports = router;