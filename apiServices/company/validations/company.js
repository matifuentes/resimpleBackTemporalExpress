const Joi = require('@hapi/joi');

const validateRegister = Joi.object({
  rutCompany: Joi.string().max(12).required(),
  nameCompany: Joi.string().min(6).max(255).required(),
  rutManager: Joi.string().max(12).required(),
  nameManager: Joi.string().min(6).max(255).required(),
  emailManager: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
});

const validateLogin = Joi.object({
  emailManager: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
});

module.exports = {validateRegister, validateLogin};