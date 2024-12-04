const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Asegurarnos de que todas las rutas tengan sus controladores correspondientes
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/remove/:itemId', cartController.removeFromCart);
router.put('/update/:itemId', cartController.updateCartItem);

module.exports = router;