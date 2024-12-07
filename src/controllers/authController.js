
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { sendConfirmationEmail } = require('../config/mailer');

// ...existing code...

const register = async (req, res) => {
    try {
        const { name, secondName, id, email, password, phone } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ $or: [{ email }, { id }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe con ese email o identificación'
            });
        }

        // Crear nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            secondName,
            id,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();

        // Enviar correo de confirmación
        const emailSent = await sendConfirmationEmail(newUser);
        
        if (!emailSent) {
            console.error('Error al enviar el correo de confirmación');
            // Aún retornamos éxito porque el usuario se creó correctamente
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario'
        });
    }
};

// ...existing code...

module.exports = {
    register,
    // ...other exports...
};