function checkAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
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

module.exports = { checkAuth, checkAdmin };