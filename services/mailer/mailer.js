import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

const mailer = async (mailOptions) => {
  // * Crear el transporte
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: 'Resimple#23',
    },
  });

  // * Agregar el plugin para usar HTML
  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.hbs',
      layoutsDir: './services/mailer/views/',
      defaultLayout: false,
      partialsDir: './services/mailer/views/',
    },
    viewPath: './services/mailer/views/',
    extName: '.hbs'
  }))

  // * Enviar el mail
  try {
    const result = await transporter.sendMail(mailOptions)
    return result
  } catch (error) {
    return error
  }
}

export default mailer