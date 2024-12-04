const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

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

router.get('/confirmacion', (req, res) => {
    res.render('pago/pago_completado.html', { title: 'Confirmación de Pago' });
});

module.exports = router;