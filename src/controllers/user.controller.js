const User = require('../models/user');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.session.user.id; 
        const user = await User.findById(userId).select('name email id profileImage');
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (user.role === 'admin') {
            res.render('admin/adminDatosPers', { user });
        } else {
            res.render('user/perfilDatosPers', { user });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { search, rol } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        if (rol) {
            query.rol = rol;
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.profileImage = req.file.path;
        }
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
};