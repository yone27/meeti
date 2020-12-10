const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const expressLayout = require('express-ejs-layouts')
const passport = require('./config/passport')
require('dotenv').config({ path: 'variables.env' })

// DB
const db = require('./config/db')
db.sync()
    .then(() => console.log('db connect'))
    .catch(err => console.log(err))

// Models
require('./models/Users')
require('./models/Categories')
require('./models/Groups')
require('./models/Meeti')
require('./models/Comments')

// Initializations
const app = express()

// Settings
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(flash())
app.use(expressLayout)
app.use((req, res, next) => {
    res.locals.usuario = { ...req.user || null }
    res.locals.mensajes = req.flash()
    res.locals.habilitarLeaftlet = 0
    const fecha = new Date()
    res.locals.year = fecha.getFullYear()
    next()
})

// Routes
app.use(require('./routes/index'))
app.use(require('./routes/groups'))
app.use(require('./routes/meetis'))
app.use(require('./routes/users'))

// Server start :D
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})