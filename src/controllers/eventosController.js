
const pool = require('../config/database');

const obtenerEventos = async (req, res) => {
    try {
        const [eventos] = await pool.query('SELECT * FROM eventos');
        res.render('eventos', { eventos });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).render('error', { 
            mensaje: 'Error al cargar los eventos',
            error: error
        });
    }
};

module.exports = {
    obtenerEventos
};