const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Groups = require('../models/Groups')
const Meeti = require('../models/Meeti')

exports.administrationPanel = async (req, res) => {
    const querys = []
    querys.push(Groups.findAll({ where: { userId: req.user.id } }))

    // Metti's que aún no han ocurrido
    querys.push(Meeti.findAll({ 
        where: {
            userId: req.user.id ,
            fecha: {
                [Op.gt]: moment(new Date()).format('YYYY-MM-DD')
            }
        },
        order: [
            ['fecha','asc']
        ]
    }))
    // Metti's que ya han ocurrido
    querys.push(Meeti.findAll({ 
        where: { 
            userId: req.user.id ,
            fecha: {
                [Op.lt]: moment(new Date()).format('YYYY-MM-DD')
            }
        } 
    }))
    const [groups, meetis, meetisAnt] = await Promise.all(querys)
    res.render('administracion', {
        nombrePagina: 'administracion',
        groups,
        meetis,
        moment,
        meetisAnt
    })
}