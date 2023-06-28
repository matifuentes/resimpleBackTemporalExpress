import express from 'express'
import mailer from '../../../services/mailer/mailer.js'


const router = express.Router()

router.post('/send-mail', async (req, res) => {
  const { mail, subject, name, verificationCode } = req.body

  const result = await mailer(mail, subject, name, verificationCode)

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