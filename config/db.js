const Sequelize = require('Sequelize')

// Configuración de la base de datos
// module.exports = new Sequelize('meeti', 'root', '', {
module.exports = new Sequelize('heroku_9a1aed26c9d296c', 'be2af88a7c267d', 'eef1cf47', {
    host: 'us-cdbr-east-02.cleardb.com',
    // host: '127.0.0.1',
    // port: '3306',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
})