
const express = require('express');
const router = express.Router();

// ...existing code...

router.get('/datos-personales', (req, res) => {
    try {
        // Fetch user data and render the page
        const userData = {}; // Replace with actual user data fetching logic
        res.render('admin/adminDatosPers', { userData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// ...existing code...

module.exports = router;