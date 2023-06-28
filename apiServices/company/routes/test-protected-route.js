import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    error: null,
    data: {
      title: 'Ruta protegida',
      user: req.user
    }
  })
});

export default router