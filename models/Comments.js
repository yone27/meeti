const Sequelize = require('Sequelize')
const db = require('../config/db')
const Meeti = require('./Meeti')
const Users = require('./Users')

const Comments = db.define('comments', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mensaje: Sequelize.TEXT,
}, {
    timestamps: false
})

Comments.belongsTo(Users)
Comments.belongsTo(Meeti)

module.exports = Comments