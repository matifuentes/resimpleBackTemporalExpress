const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');

  // * Validar que exista el token
  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Acceso denegado, no se encontró el token'
    })
  }

  // * Validar que el token corresponda
  try {
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'El token no es válido'
    })
  }
}

module.exports = verifyToken;