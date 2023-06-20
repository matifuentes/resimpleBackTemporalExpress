import Joi from '@hapi/joi'

const validateRegister = Joi.object({
  rutCompany: Joi.string().max(12).required(),
  nameCompany: Joi.string().min(6).max(255).required(),
  sizeCompany: Joi.string().valid('Micro', 'Pequeña', 'Mediana', 'Grande').required(),
  rutManager: Joi.string().max(12).required(),
  nameManager: Joi.string().min(6).max(255).required(),
  emailManager: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
});

const validateLogin = Joi.object({
  emailManager: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
});

export { validateRegister, validateLogin }