const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const meetiControllerFE = require('../controllers/frontend/meetiControllerFE')
const usersControllerFE = require('../controllers/frontend/usersControllerFE')
const groupsControllerFE = require('../controllers/frontend/groupsControllerFE')
const searchControllerFE = require('../controllers/frontend/searchControllerFE')
const commentsControllerFE = require('../controllers/frontend/commentsControllerFE')

// Area pública
router.get('/', homeController.home)

// Muestra un meeti
router.get('/meeti/:slug', meetiControllerFE.getMeeti)

// Confirma asistencia a meeti
router.post('/confirmar-asistencia/:slug', meetiControllerFE.confirmAssistance)

// Muestra interesados
router.get('/asistentes/:slug', meetiControllerFE.getAssistants)

// Muestra perfiles
router.get('/usuarios/:id', usersControllerFE.getUser)

// Muestra perfiles
router.get('/usuarios/:id', usersControllerFE.getUser)

// Muestra interesados
router.get('/grupos/:id', groupsControllerFE.getGroups)

// Agrega comentarios en el meeti
router.post('/meeti/:id', commentsControllerFE.saveComment)

// Eliminar comentarios en el meeti
router.post('/eliminar-comentario', commentsControllerFE.deleteComment)

// Muestra meetis por categoria
router.get('/categoria/:categoria', meetiControllerFE.getCategory)

// Añade la busqueda
router.get('/busqueda', searchControllerFE.searchResults)

// Administration panel
router.get('/administracion',
    authController.isAuthenticated,
    adminController.administrationPanel
)

module.exports = router;
