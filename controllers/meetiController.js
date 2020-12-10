const { v4: uuidv4 } = require('uuid');

const Groups = require('../models/Groups')
const Meeti = require('../models/Meeti')

exports.formSaveMeeti = async (req, res) => {
    const groups = await Groups.findAll({ where: { userId: req.user.id } })

    // habilitamos la carga de leaftlet
    habilitarLeaftlet = 1

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear nuevo Meeti',
        groups,
        habilitarLeaftlet
    })
}
exports.saveMeeti = async (req, res) => {
    const meeti = req.body
    // asignar el user
    meeti.userId = req.user.id

    // almacena la ubi con un point
    const point = {
        type: 'Point',
        coordinates: [parseFloat(meeti.lat), parseFloat(meeti.lng)]
    }
    meeti.ubicacion = point
    if (meeti.cupo === '') {
        meeti.cupo = 0
    }
    meeti.id = uuidv4()

    // Almacenar en la db
    try {
        await Meeti.create(meeti)
        req.flash('exito', 'Se ha creado el meeti correctamente')
        res.redirect('/administracion')
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message)
        req.flash('error', erroresSequelize)
        res.redirect('/nuevo-meeti')
    }
}
exports.formUpadateMeeti = async (req, res, next) => {
    const querys = []
    querys.push(Groups.findAll({ where: { userId: req.user.id } }))
    querys.push(Meeti.findByPk(req.params.id))
    const [groups, meeti] = await Promise.all(querys)
    
    // habilitamos la carga de leaftlet
    habilitarLeaftlet = 1

    if (!groups || !meeti) {
        req.flash('error', 'Operación no valida')
        res.redirect('/administracion')
        return next()
    }

    res.render('editar-meeti', {
        nombrePagina: `Editar Meeti: ${meeti.titulo}`,
        groups,
        meeti
    })
}
exports.upadateMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({ where: { id: req.params.id, userId: req.user.id } })

    if (!meeti) {
        req.flash('error', 'Operación no valida')
        res.redirect('/administracion')
        return next()
    }

    const { groupId, titulo, invitado, fecha, hora, cupo, descripion, direccion, ciudad, estado, pais, lat, lng } = req.body

    meeti.groupId = groupId
    meeti.titulo = titulo
    meeti.invitado = invitado
    meeti.fecha = fecha
    meeti.hora = hora
    meeti.cupo = cupo
    meeti.descripion = descripion
    meeti.direccion = direccion
    meeti.ciudad = ciudad
    meeti.estado = estado
    meeti.pais = pais

    const point = { type: 'Point', coordinates: [parseFloat(lat), parseFloat(lng)] }
    meeti.ubicacion = point

    try {
        await meeti.save()
        req.flash('exito', 'Se ha editado el meeti correctamente')
        res.redirect('/administracion')
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message)
        req.flash('error', erroresSequelize)
        res.redirect(`/editar-meeti/${meeti.id}`)
    }
}
exports.formDeleteMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({ where: { id: req.params.id, userId: req.user.id } })

    if (!meeti) {
        req.flash('error', 'Operación no valida')
        res.redirect('/administracion')
        return next()
    }

    res.render('eliminar-meeti', {
        nombrePagina: `Eliminar Meeti: ${meeti.titulo}`,
        meeti
    })
}
exports.deleteMeeti = async (req, res, next) => {
    await Meeti.destroy({ where: { id: req.params.id, userId: req.user.id } })

    req.flash('exito', 'Meeti eliminado')
    res.redirect('/administracion')
}
