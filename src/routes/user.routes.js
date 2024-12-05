const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/admin/datos-personales', userController.getUserProfile);

module.exports = router;