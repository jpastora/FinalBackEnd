const User = require('../models/user');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId); // Assuming user ID is stored in session
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('adminDatosPers', { userData: user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getUserProfile,
};