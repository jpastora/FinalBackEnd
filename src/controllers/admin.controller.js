const User = require('../models/user');

const getAdminProfile = async (req, res) => {
    try {
        const userId = req.session.user.id; 
        const userData = await User.findById(userId).select('name email id profileImage');
        if (!userData) {
            return res.status(404).send('User not found');
        }
        res.render('admin/adminDatosPers', { userData }); 
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAdminProfile,
};
