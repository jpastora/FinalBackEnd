const express = require('express');
const router = express.Router();
const { getUserData } = require('../controllers/controller');

// Route to render the adminDatosPers page
router.get('/admin/perfil', getUserData);

module.exports = router;