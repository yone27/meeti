const Sequelize = require('Sequelize')
const slug = require('slug')
const shortid = require('shortid')
const db = require('../config/db')
const Users = require('./Users')
const Groups = require('./Groups')

const Meeti = db.define('meeti', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un titulo'
            }
        }
    },
    invitado: Sequelize.STRING,
    cupo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una descripcion'
            }
        }
    },
    fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un la fecha para el meteei'
            }
        }
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una hora'
            }
        }
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una direccion'
            }
        }
    },
    ciudad: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una ciudad'
            }
        }
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una estado'
            }
        }
    },
    pais: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una pais'
            }
        }
    },
    ubicacion: {
        type: Sequelize.GEOMETRY('POINT')
    },
    interesados: {
        type: Sequelize.STRING
    },
    slug: {
        type: Sequelize.STRING
    }
}, {
    hooks: {
        async beforeCreate(meeti) {
            const url = slug(meeti.titulo).toLocaleLowerCase()
            meeti.slug = `${url}-${shortid.generate()}`
        }
    }
})
Meeti.belongsTo(Users)
Meeti.belongsTo(Groups)

module.exports = Meeti