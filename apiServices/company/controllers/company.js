import Company from '../models/TemporalCompany.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// * Validations Schemas
import { validateRegister, validateLogin } from '../validations/company.js'

const controllerRegister = async (req, res) => {
  // * Validar datos
  const { error } = validateRegister.validate(req.body)
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message
    })
  }

  const existEmail = await Company.findOne({ emailManager: req.body.emailManager.toLowerCase() });
  if (existEmail) {
    return res.status(400).json({
      error: true,
      message: 'Email ya registrado'
    })
  }

  // * Hash de password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt)

  // * Acá se capturan los datos y se almacenan en "company"
  const company = new Company({
    rutCompany: req.body.rutCompany,
    nameCompany: req.body.nameCompany,
    rutManager: req.body.rutManager,
    nameManager: req.body.nameManager,
    emailManager: req.body.emailManager.toLowerCase(),
    password
  });

  try {
    const companyDB = await company.save();

    res.json({
      error: null,
      data: companyDB
    })

  } catch (error) {
    res.status(400).json(error);
  }
}

const controllerLogin = async (req, res) => {
  // * Validar datos
  const { error } = validateLogin.validate(req.body)
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message
    })
  }

  // * Validar que la company exista
  const company = await Company.findOne({ emailManager: req.body.emailManager.toLowerCase() });
  if (!company) {
    return res.status(400).json({
      error: true,
      message: 'Email no encontrado'
    })
  }

  // * Validar password
  const validatePassword = await bcrypt.compare(req.body.password, company.password);
  if (!validatePassword) {
    return res.status(400).json({
      error: true,
      message: 'Password inválida'
    })
  }

  // * Creación del JWT
  const token = jwt.sign({
    rutCompany: company.rutCompany,
    nameCompany: company.nameCompany,
    rutManager: company.rutManager,
    nameManager: company.nameManager,
    emailManager: company.emailManager,
    id: company._id
  }, process.env.TOKEN_SECRET);

  // * Envío de JWT
  res.header('auth-token', token).json({
    error: null,
    data: { token }
  })
}

export {
  controllerRegister, controllerLogin
};