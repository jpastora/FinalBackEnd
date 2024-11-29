const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pago/pagos.html', { title: 'Pago' });
});

router.get('/carrito', (req, res) => {
    res.render('pago/pagos.html', { title: 'Carrito' });
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