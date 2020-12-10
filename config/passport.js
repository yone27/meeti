const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/Users')

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, next) => {
        const user = await Users.findOne({ 
            where: { email, activo: 1 } 
        })

        // revisar si existe o no
        if(!user) return next(null, false, {
            message: 'Ese usuario no existe o no has confirmado'
        })

        // Comparar password
        if(!user.verificarPassword(password)) return next(null, false, {
            message: 'Password incorrecto'
        })

        // todo ok
        return next(null, user)
    }
))

// serealizar 
passport.serializeUser((user, callback) => {
    callback(null, user)
})

// deserealizar
passport.deserializeUser((user, callback) => {
    callback(null, user)
})

module.exports = passport