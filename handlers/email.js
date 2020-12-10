const nodemailer = require('nodemailer')
const emailConfig = require('../config/email')
const fs = require('fs')
const util = require('util')
const ejs = require('ejs')

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
})

exports.enviarEmail = async opc => {
    // leer el template
    const archivo = __dirname + `/../views/emails/${opc.archivo}.ejs`

    // compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'))

    // crear html
    const html = compilado({ url: opc.url })

    // config opc
    const opcionesEmail = {
        from: 'Meeti <noreply@metti.com>',
        to: opc.user.email,
        subject: opc.subject,
        html
    }

    // enviar email
    const sendEmail = util.promisify(transport.sendMail, transport)
    return sendEmail.call(transport, opcionesEmail)
}