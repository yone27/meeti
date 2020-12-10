const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

const Users = require('../models/Users')
const enviarEmail = require('../handlers/email')

const multerConfig = {
    limits: { fileSize: 800000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/profiles')
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
exports.formSignUp = (req, res) => {
    res.render('nueva-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    })
}
exports.signUp = async (req, res) => {
    const user = req.body

    const { password, confirmar } = user
    let erroresManuales = []

    if (!confirmar) {
        erroresManuales.push('Confirmacion de password vacio')
    }
    if (confirmar === password) {
        erroresManuales.push('Los passwords deben coincidir')
    }

    try {
        const usuario = await Users.create(user)

        // enviar email confirmacion
        // const url = `http://${req.headers.host}/confirmar-cuenta/${user.email}`
        // await enviarEmail.enviarEmail({
        //     user,
        //     url,
        //     subject: 'confirmar tu cuenta meeti',
        //     archivo: 'confirmar-cuenta'
        // })
        usuario.activo = 1
        await usuario.save()
        req.flash('exito', 'Hemos enviao un email, confirma tu cuenta')
        res.redirect('/iniciar-sesion')
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message)
        const errors = [...erroresManuales, ...erroresSequelize]
        req.flash('error', errors)
        res.redirect('/crear-cuenta')
    }
}
exports.confirmAccount = async (req, res, next) => {
    // Verificar que exista el usuario
    const user = await Users.findOne({ where: { email: req.params.email } })
    if (!user) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/crear-cuenta')
        return next()
    }

    user.activo = 1
    await user.save()
    req.flash('exito', 'La cuenta se ha confirmado, inicia sesion')
    res.redirect('/iniciar-sesion')
}
exports.formSignIn = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion'
    })
}

// Perfil de usuario
exports.formUpdateProfile = async (req, res) => {
    const user = await Users.findByPk(req.user.id)

    res.render('editar-perfil', {
        nombrePagina: 'Editar perfil',
        user
    })
}
exports.updateProfile = async (req, res) => {
    const user = await Users.findByPk(req.user.id)
    const { nombre, descripcion, email } = req.body

    user.nombre = nombre
    user.descripcion = descripcion
    user.email = email

    await user.save()
    req.flash('exito', 'Cambios guardados correctamente')
    res.redirect('/administracion')
}
exports.formUpdatePassword = async (req, res) => {
    res.render('editar-password', { nombrePagina: 'Editar Contraseña' })
}
exports.updatePassword = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id)

    // verificar que el pass ant sea correcto
    if (!user.verificarPassword(req.body.anterior)) {
        req.flash('error', 'el password actual es incorrecto')
        res.redirect('/administracion')
        return next()
    }

    // si es correcto se hashea
    const hash = user.hashPassword(req.body.nuevo)
    user.password = hash

    // guardar y redireccionar
    await user.save()
    req.logout()
    req.flash('exito', 'Password modificado correctamente')
    res.redirect('/administracion')
}
exports.formUpdateProfileImage = async (req, res) => {
    const user = await Users.findByPk(req.user.id)

    res.render('imagen-perfil', {
        nombrePagina: 'Subir Imagen de perfil',
        user
    })
}
exports.updateProfileImage = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id)

    // Si hay imagen anterior
    if (user.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/profiles/${user.imagen}`
        // eliminar archivo con fs
        fs.unlink(imagenAnteriorPath, error => {
            if (error) {
                console.log(error);
            }
            return
        })
    }
    // Almacenar la nueva imagen
    if (req.file) {
        user.imagen = req.file.filename
    }
    // Almacenar y redireccionar
    await user.save()
    req.flash('exito', 'Cambios almacenados correctamente')
    res.redirect('/administracion')
}
