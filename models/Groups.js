const Sequelize = require('Sequelize')
const db = require('../config/db')
const Categories = require('./Categories')
const Users = require('./Users')

const Groups = db.define('groups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El grupo debe tener un nombre'
            }
        }
    },
    descripcion: {
        type: Sequelize.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una descripción'
            }
        }
    },
    url: Sequelize.TEXT,
    imagen: Sequelize.TEXT
})

Groups.belongsTo(Categories) // 1:1
Groups.belongsTo(Users) // 1:1

module.exports = Groups