const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const Categories = require('../models/Categories')
const Groups = require('../models/Groups')

const multerConfig = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/groups')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1]
            next(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            // true acepta el file
            next(null, true)
        } else {
            next(new Error('Formato no válido'), false)
        }
    }
}

const upload = multer(multerConfig).single('imagen')

exports.uploadImage = async (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande')
                } else {
                    req.flash('error', error.message)
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message)
            }
            res.redirect('back')
            return
        } else {
            next()
        }
    })
}
exports.formSaveGroup = async (req, res) => {
    const categories = await Categories.findAll()
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categories
    })
}
exports.saveGroup = async (req, res) => {
    const group = req.body
    group.userId = req.user.id
    group.categoryId = req.body.categoria

    //leyendo imagen
    if (req.file) {
        group.imagen = req.file.filename
    }
    group.id = uuidv4()

    try {
        await Groups.create(group)
        req.flash('exito', 'Se ha creado el grupo correctamente')
        res.redirect('/administracion')
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message)
        req.flash('error', erroresSequelize)
        res.redirect('/nuevo-grupo')
    }
}
exports.formUpdateGroup = async (req, res) => {
    const querys = []
    querys.push(Groups.findByPk(req.params.groupId))
    querys.push(Categories.findAll())

    // Promise await
    const [group, categories] = await Promise.all(querys)
    res.render('editar-grupo', {
        nombrePagina: `Editar grupo ${group.nombre}`,
        group,
        categories
    })
}
exports.updateGroup = async (req, res, next) => {
    const group = await Groups.findOne({ where: { id: req.params.groupId, userId: req.user.id } })

    // si no existe, o no es el dueño
    if (!group) {
        req.flash('error', 'Operacion no valida')
        res.redirect('/administracion')
        return next()
    }

    const { nombre, descripcion, categoria, url } = req.body
    group.nombre = nombre
    group.descripcion = descripcion
    group.categoryId = parseInt(categoria)
    group.url = url

    await group.save()
    req.flash('exito', 'Cambios almacenados correctamente')
    res.redirect('/administracion')
}
exports.formUpdateImage = async (req, res, next) => {
    const group = await Groups.findByPk(req.params.groupId)

    res.render('imagen-grupo', {
        nombrePagina: `Editar imagen grupo: ${group.nombre}`,
        group
    })
}
exports.updateImage = async (req, res, next) => {
    const group = await Groups.findOne({ where: { id: req.params.groupId, userId: req.user.id } })

    // Grupo no valido
    if (!group) {
        req.flash('error', 'Operacion no valida')
        res.redirect('/administracion')
        return next()
    }

    // ambas imagenes
    if (req.file && group.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/groups/${group.imagen}`
        // eliminar archivo con fs
        fs.unlink(imagenAnteriorPath, error => {
            if (error) {
                console.log(error);
            }
            return
        })
    }

    // solo una imagen nueva
    if (req.file) {
        group.imagen = req.file.filename
    }

    await group.save()
    req.flash('exito', 'Cambios almacenados correctamente')
    res.redirect('/administracion')
}
exports.formDeleteGroup = async (req, res, next) => {
    const group = await Groups.findOne({ where: { id: req.params.groupId, userId: req.user.id } })
    
    // NO exite, operacion no valida
    if (!group) {
        req.flash('error', 'Operacion no valida')
        res.redirect('/administracion')
        return next()
    }

    res.render('eliminar-grupo', {nombrePagina: `Eliminar grupo ${group.nombre}`})
}
exports.deleteGroup = async (req, res, next) => {
    const group = await Groups.findOne({ where: { id: req.params.groupId, userId: req.user.id } })
    
    // NO exite, operacion no valida
    if (!group) {
        req.flash('error', 'Operacion no valida')
        res.redirect('/administracion')
        return next()
    }

    // Eliminamos imagen
    if (group.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/groups/${group.imagen}`
        // eliminar archivo con fs
        fs.unlink(imagenAnteriorPath, error => {
            if (error) {
                console.log(error);
            }
            return
        })
    }
    // Eliminamos grupo
    await Groups.destroy({
        where: {
            id: req.params.groupId
        }
    })

    req.flash('exito', 'Grupo eliminado')
    res.redirect('/administracion')
}