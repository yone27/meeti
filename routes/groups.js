const router = require('express').Router();

const authController = require('../controllers/authController')
const groupsController = require('../controllers/groupsController')

router
    .get('/nuevo-grupo',
        authController.isAuthenticated,
        groupsController.formSaveGroup
    )
    .post('/nuevo-grupo',
        authController.isAuthenticated,
        groupsController.uploadImage,
        groupsController.saveGroup
    )
router
    .get('/editar-grupo/:groupId',
        authController.isAuthenticated,
        groupsController.formUpdateGroup
    )
    .post('/editar-grupo/:groupId',
        authController.isAuthenticated,
        groupsController.updateGroup
    )
router
    .get('/imagen-grupo/:groupId',
        authController.isAuthenticated,
        groupsController.formUpdateImage
    )
    .post('/imagen-grupo/:groupId',
        authController.isAuthenticated,
        groupsController.uploadImage,
        groupsController.updateImage
    )
router
    .get('/eliminar-grupo/:groupId',
        authController.isAuthenticated,
        groupsController.formDeleteGroup
    )
    .post('/eliminar-grupo/:groupId',
        authController.isAuthenticated,
        groupsController.deleteGroup
    )

module.exports = router;