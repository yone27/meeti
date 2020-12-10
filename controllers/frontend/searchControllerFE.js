const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')

const Meeti = require('../../models/Meeti')
const Groups = require('../../models/Groups')
const Users = require('../../models/Users')

exports.searchResults = async (req, res) => {
    const { categoria, titulo, ciudad, pais } = req.query

    // si no hay categoria
    let query

    if(categoria === '') {
        query = ''
    }else{
        query = `where: {
            categoryId: { [Op.eq]: ${categoria} }
        }`
    }

    // Filtrar
    const meetis = await Meeti.findAll({
        where: {
            titulo: { [Op.like]: '%' + titulo + '%' },
            ciudad: { [Op.like]: '%' + ciudad + '%' },
            pais: { [Op.like]: '%' + pais + '%' }
        },
        include: [
            {
                model: Groups,
                query
            },
            {
                model: Users,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    res.render('busqueda', {
        nombrePagina: 'Resultado busqueda',
        meetis,
        moment
    })
}