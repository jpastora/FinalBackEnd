const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/perfil', userController.getUserProfile);

module.exports = router;