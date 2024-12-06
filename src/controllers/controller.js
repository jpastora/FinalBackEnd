const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email id profileImage'); // Ensure 'id' is selected
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        console.log('User Data:', user);

        res.render('admin/adminDatosPers', {
            user
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getUserData
};