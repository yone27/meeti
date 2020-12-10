const router = require('express').Router();

const authController = require('../controllers/authController')
const usersController = require('../controllers/usersController')

router
    .get('/crear-cuenta', usersController.formSignUp)
    .post('/crear-cuenta', usersController.signUp)
router
    .get('/iniciar-sesion', usersController.formSignIn)
    .post('/iniciar-sesion', authController.signIn)

router.get('/cerrar-sesion',
    authController.isAuthenticated,
    authController.logout)

router.get('/confirmar-cuenta/:email', usersController.confirmAccount)

// Perfil
router
    .get('/editar-perfil',
        authController.isAuthenticated,
        usersController.formUpdateProfile
    )
    .post('/editar-perfil',
        authController.isAuthenticated,
        usersController.updateProfile
    )
router
    .get('/editar-password',
        authController.isAuthenticated,
        usersController.formUpdatePassword
    )
    .post('/editar-password',
        authController.isAuthenticated,
        usersController.updatePassword
    )
router
    .get('/imagen-perfil',
        authController.isAuthenticated,
        usersController.formUpdateProfileImage
    )
    .post('/imagen-perfil',
        authController.isAuthenticated,
        usersController.uploadImage,
        usersController.updateProfileImage
    )

module.exports = router;