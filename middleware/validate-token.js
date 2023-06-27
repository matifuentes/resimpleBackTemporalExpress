import jwt from 'jsonwebtoken'

const getUser = token => {
  try {
    if (token) {
      const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET)
      return verifiedToken
    }

    return null
  } catch (error) {
    return null
  }
}

export default getUser