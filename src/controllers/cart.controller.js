const Cart = require('../models/cart');
const Evento = require('../models/evento');

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ usuario: req.session.user._id })
            .populate('items.evento');

        if (!cart) {
            cart = { items: [], total: 0 };
        }

        const subtotal = cart.total || 0;
        const iva = subtotal * 0.13;
        const totalConIva = subtotal + iva;

        res.render('pago/pagos.html', {
            title: 'Carrito',
            cart,
            subtotal,
            iva,
            total: totalConIva
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).render('error.html', {
            title: 'Error',
            message: 'Error al cargar el carrito',
            cart: { items: [] }, 
            subtotal: 0,
            iva: 0,
            total: 0
        });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { eventoId, cantidad, precio } = req.body;
        
        // Verificar que el usuario esté en la sesión
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const userId = req.session.user._id;
        console.log('Usuario ID:', userId); // Debug

        // Buscar carrito existente
        let cart = await Cart.findOne({ usuario: userId });
        console.log('Carrito encontrado:', cart); // Debug

        if (!cart) {
            // Crear nuevo carrito
            cart = new Cart({
                usuario: userId,
                items: [{
                    evento: eventoId,
                    cantidad: cantidad,
                    precioUnitario: precio
                }],
                total: precio * cantidad
            });
        } else {
            // Verificar si el evento ya está en el carrito
            const existingItemIndex = cart.items.findIndex(
                item => item.evento.toString() === eventoId
            );

            if (existingItemIndex > -1) {
                // Actualizar cantidad
                cart.items[existingItemIndex].cantidad += cantidad;
            } else {
                // Agregar nuevo item
                cart.items.push({
                    evento: eventoId,
                    cantidad: cantidad,
                    precioUnitario: precio
                });
            }

            // Recalcular total
            cart.total = cart.items.reduce((total, item) => {
                return total + (item.precioUnitario * item.cantidad);
            }, 0);
        }

        await cart.save();
        console.log('Carrito guardado:', cart); // Debug

        res.json({
            success: true,
            message: 'Evento agregado al carrito exitosamente'
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar al carrito: ' + error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const cart = await Cart.findOne({ usuario: req.session.user.userId });
        
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.precioUnitario * item.cantidad);
        }, 0);

        await cart.save();
        res.json({ success: true, message: 'Item eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar del carrito' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { cantidad } = req.body;
        
        const cart = await Cart.findOne({ usuario: req.session.user.userId });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Carrito no encontrado' 
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item no encontrado en el carrito' 
            });
        }

        cart.items[itemIndex].cantidad = cantidad;

        cart.total = cart.items.reduce((total, item) => {
            return total + (item.precioUnitario * item.cantidad);
        }, 0);

        await cart.save();

        res.json({ 
            success: true, 
            message: 'Cantidad actualizada correctamente' 
        });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar cantidad' 
        });
    }
};

module.exports = {
    getCart,
    addToCart: exports.addToCart, 
    removeFromCart,
    updateCartItem
};