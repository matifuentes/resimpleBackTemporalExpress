import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  //const token = req.header('Authorization');
  const splitedToken = req.header('Authorization').split(" ");
  if (splitedToken[0].toLowerCase() != 'bearer') {
    return res.status(401).json({
      error: true,
      message: 'Acceso denegado, no se encontró el token'
    })
  }

  const token = splitedToken[1]

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

export default verifyToken