const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Categories = require('../models/Categories')
const Meeti = require('../models/Meeti')
const Groups = require('../models/Groups')
const Users = require('../models/Users')

exports.home = async (req, res) => {
    const querys = []
    querys.push(Categories.findAll({}))
    querys.push(Meeti.findAll({
        attributes: ['slug', 'titulo', 'fecha', 'hora'],
        where: {
            fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") }
        },
        limit: 3,
        order: [
            ['fecha', 'asc']
        ],
        // Aqui se hace el join
        include : [
            {
                model: Groups,
                attributes: ['imagen']
            },
            {
                model: Users,
                attributes: ['nombre', 'imagen']
            }
        ]
    }))

    const [categories, meetis] = await Promise.all(querys)
    
    res.render('home', {
        nombrePagina: 'Incio',
        categories,
        meetis,
        moment
    })
}