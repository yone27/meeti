const Sequelize = require('Sequelize')
const db = require('../config/db')

const Categories = db.define('categories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.TEXT,
    slug: Sequelize.TEXT
}, {
    timestamps: false
})

module.exports = Categories