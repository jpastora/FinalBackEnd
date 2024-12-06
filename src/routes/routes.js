const express = require('express');
const router = express.Router();
const { getUserData } = require('../controllers/controller');

// Route to render the adminDatosPers page
router.get('/admin/datos-personales', getUserData);

module.exports = router;