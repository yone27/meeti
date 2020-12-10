const passport = require('passport')

exports.signIn = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    // sino esta autenticado
    return res.redirect('/iniciar-sesion')
}
exports.logout = (req, res, next) => {
    req.logout()
    req.flash('exito', 'Cerraste sesion correctamente')
    res.redirect('/iniciar-sesion')
    next()
}