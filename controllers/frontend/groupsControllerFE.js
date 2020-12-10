const moment = require('moment')

const Meeti = require('../../models/Meeti')
const Groups = require('../../models/Groups')

exports.getGroups = async (req, res, next) => {
    const querys = []

    // Tambien lo puedes hacer con un "join" pero no es la mejor manera
    querys.push(Groups.findOne({ where: { id: req.params.id } }))
    querys.push(Meeti.findAll({ 
        where: { groupId: req.params.id },
        order: [
            ['fecha', 'asc']
        ]
    }))

    const [grupo, meetis] = await Promise.all(querys)

    if (!grupo) {
        res.redirect('/')
        return next()
    }

    res.render('mostrar-grupo', {
        nombrePagina: `Información grupo: ${grupo.nombre}`,
        grupo,
        meetis,
        moment
    })
}