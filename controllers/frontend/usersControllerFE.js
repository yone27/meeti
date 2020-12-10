const Users = require('../../models/Users')
const Groups = require('../../models/Groups')

exports.getUser = async (req,res,next)=>{
    const querys = []

    // Tambien lo puedes hacer con un "join" pero no es la mejor manera
    querys.push( Users.findOne({ where: {id: req.params.id}}))
    querys.push( Groups.findAll({ where: {userId: req.params.id}}))

    const [user, groups] = await Promise.all(querys)

    if(!user) {
        res.redirect('/')
        return next()
    }
    res.render('mostrar-perfil', {
        nombrePagina: `Perfil Usuario: ${user.nombre}`,
        user,
        groups
    })
}