const moment = require('moment')

const Meeti = require('../../models/Meeti')
const Groups = require('../../models/Groups')
const Users = require('../../models/Users')
const Comments = require('../../models/Comments')
const Categories = require('../../models/Categories')

exports.getMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug
        },
        include: [
            {
                model: Groups,
            },
            {
                model: Users,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    // sino existe
    if (!meeti) {
        res.redirect('/')
    }

    // Comentarios
    const comments = await Comments.findAll({
        where: { meetiId: meeti.id },
        include : [
            {
                model: Users,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    res.render('mostrar-metti', {
        nombrePagina: meeti.titulo,
        meeti,
        moment,
        comments
    })
}
exports.confirmAssistance = async (req, res, next) => {
    const meet = await Meeti.findOne({
        where: {
            slug: req.params.slug
        }
    })

    // Logica para guardar interesados en el meet
    if (meet.interesados) {
        let interesados = meet.interesados.split('-')
        if (interesados.find(test => test == req.user.id)) {
            meet.interesados = interesados.filter(test => test != req.user.id).join('-')
        } else {
            interesados.push(req.user.id)
            meet.interesados = interesados.join('-')
        }
    } else {
        meet.interesados = req.user.id
    }

    await meet.save()

    res.send('correcto')
}
exports.getAssistants = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug
        },
        attributes: ['interesados']
    })

    if (!meeti) {
        res.redirect('/')
    }
    const { interesados } = meeti
    let asistentes = []

    if (interesados) {
        asistentes = await Users.findAll({
            where: {
                id: interesados.split('-')
            },
            attributes: ['nombre', 'imagen']
        })
    }
    
    res.render('asistentes-meeti', {
        nombrePagina: 'Listado asistentes meeti',
        asistentes
    })

}
exports.getCategory = async (req, res, next) => {
    const categoria = await Categories.findOne({
        where: {
            slug: req.params.categoria
        },
        attributes: ['id', 'nombre'],
    })

    // sino existe
    if (!categoria) {
        res.redirect('/')
        return next()
    }

    const meetis = await Meeti.findAll({
        include: [
            {
                model: Groups,
                where: { categoryId: categoria.id }
            },
            {
                model: Users
            }
        ],
        order: [
            ['fecha', 'asc'],
            ['hora', 'asc']
        ]
    })

    res.render('categoria', {
        nombrePagina: `Categoria: ${categoria.nombre}`,
        meetis,
        moment
    })

}