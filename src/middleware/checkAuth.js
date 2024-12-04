function checkAuth(req, res, next) {
    console.log('CheckAuth - Sesión:', req.session);
    console.log('CheckAuth - Usuario:', req.session?.user);
    
    if (req.session && req.session.user && req.session.user._id) { // Cambiado de userId a _id
        return next();
    }
    
    // Guardar la URL a la que intentaba acceder
    req.session.returnTo = req.originalUrl;
    
    res.redirect('/auth/login');
}

function checkAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.rol === 'admin') {
        return next();
    }
    res.status(403).render('error.html', { 
        title: 'Acceso Denegado',
        message: 'No tienes permisos para acceder a esta área'
    });
}

const isAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

exports.checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        console.log('Usuario autenticado:', req.session.user); // Debug
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'No autorizado'
        });
    }
};

module.exports = {
    checkAuth,
    checkAdmin,
    isAuth
};