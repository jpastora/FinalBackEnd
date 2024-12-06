const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); 
        const userData = await UserData.findOne({ userId: req.user.id }, 'name email id profileImage'); 

        if (!userData) {
            console.log('User Data is null or undefined');
        } else {
            console.log('User Data:', userData);
        }

        res.render('admin/adminDatosPers', {
            user,
            userData
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getUserData
};