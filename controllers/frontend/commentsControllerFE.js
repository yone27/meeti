const Comments = require('../../models/Comments')
const Meeti = require('../../models/Meeti')

exports.saveComment = async (req, res, next) => {
    const { comment } = req.body

    // Crear comentario en la db
    await Comments.create({
        mensaje: comment,
        userId: req.user.id,
        meetiId: req.params.id
    })

    // Redireccionar
    res.redirect('back')
    next()
}
exports.deleteComment = async (req, res, next) => {
    const { comentarioId } = req.body

    // query
    const comment = await Comments.findOne({
        where: { id: comentarioId }
    })

    if (!comment) {
        res.status(404).send('Acción no válida')
        return next()
    }

    // meeti del comentario
    const meeti = await Meeti.findOne({
        where: {id: comment.meetiId }
    })

    if (comment.userId === req.user.id || req.user.id === meeti.userId ) {
        await comment.destroy({
            where: { id: comment.id }
        })
        res.status(200).send('Eliminado correctamente')
        return next()
    } else {
        res.status(403).send('Acción no válida')
        return next()
    }
}