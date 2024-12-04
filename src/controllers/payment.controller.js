const Cart = require('../models/cart');
const User = require('../models/user');

const getCarrito = async (req, res) => {
    try {
        console.log('Usuario en sesión:', req.session.user); // Debug

        const cart = await Cart.findOne({ usuario: req.session.user._id })
            .populate('items.evento');

        // Valores por defecto si no hay carrito
        const cartData = cart || { items: [], total: 0 };
        const subtotal = cartData.total || 0;
        const iva = subtotal * 0.13;
        const total = subtotal + iva;

        console.log('Datos del carrito:', cartData); // Debug

        res.render('pago/pagos.html', {
            cart: cartData,
            subtotal,
            iva,
            total
        });
    } catch (error) {
        console.error('Error en getCarrito:', error);
        res.status(500).render('error.html', {
            message: 'Error al cargar el carrito'
        });
    }
};

// Agregar más métodos según necesites
module.exports = {
    getCarrito
};