const router = require('express').Router();

const meetiController = require('../controllers/meetiController')
const authController = require('../controllers/authController')

router
    .get('/nuevo-meeti',
        authController.isAuthenticated,
        meetiController.formSaveMeeti
    )
    .post('/nuevo-meeti',
        authController.isAuthenticated,
        meetiController.saveMeeti
    )
router
    .get('/editar-meeti/:id',
        authController.isAuthenticated,
        meetiController.formUpadateMeeti
    )
    .post('/editar-meeti/:id',
        authController.isAuthenticated,
        meetiController.upadateMeeti
    )
router
    .get('/eliminar-meeti/:id',
        authController.isAuthenticated,
        meetiController.formDeleteMeeti
    )
    .post('/eliminar-meeti/:id',
        authController.isAuthenticated,
        meetiController.deleteMeeti
    )

module.exports = router;