import express from 'express'
import mailer from '../../../services/mailer/mailer.js'


const router = express.Router()

router.post('/send-mail', async (req, res) => {
  const { mail, subject, name, verificationCode } = req.body

  // * Agregar las options para el envío
  const mailOptions = {
    from: `ReSimple <${process.env.EMAIL_SENDER}>`,
    to: mail,
    subject,
    template: 'validate-code',
    context: {
      name,
      verificationCode
    }
  }

  const result = await mailer(mailOptions)

  if (!result?.messageId) {
    return res.status(400).json({
      ok: false,
      data: {
        status: 'Error',
        message: 'No se pudo enviar el email'
      }
    })
  }

  return res.status(200).json({
    ok: true,
    data: {
      status: 'Success',
      message: 'Email enviado correctamente'
    }
  })


});

export default router