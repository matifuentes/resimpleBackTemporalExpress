import TemporalCompany from './models/TemporalCompany.js'
import Company from './models/Company.js'
import { } from '../../db.js'
import bcrypt from 'bcrypt'
import { validateRegister, validateLogin } from './validations/company.js'
import jwt from 'jsonwebtoken'
import { UserInputError } from 'apollo-server'
import gen6digitsNumber from './utils.js'

const resolvers = {
  Query: {
    companyCount: () => TemporalCompany.collection.countDocuments(),
    allCompanies: async (root, args) => {
      return TemporalCompany.find({})
    },
    findCompany: async (root, args) => {
      const { nameCompany } = args
      return TemporalCompany.find({ nameCompany })
    },
    validateCode: async (root, args) => {
      const { emailManager, validationCode } = args

      try {
        const dataTemporalCompany = await TemporalCompany.findOne({ emailManager })
        if (!dataTemporalCompany) {
          throw new Error('Email no encontrado')
        }

        if (dataTemporalCompany.trying == 0) {
          throw new Error('No tienes más intentos disponibles');
        }

        if (validationCode !== dataTemporalCompany.validationCode) {
          const tries = dataTemporalCompany.trying > 0 ? dataCompany.trying - 1 : dataCompany.trying
          const filter = { _id: dataTemporalCompany._id }
          const update = { trying: tries }
          const updatedCompany = await TemporalCompany.findOneAndUpdate(filter, update, {
            returnOriginal: false
          })

          return updatedCompany;
        } else {
          // * La data coincide, realizo una inserción en la tabla Company

          const { rutCompany, nameCompany, sizeCompany, rutManager, nameManager, emailManager, password } = dataTemporalCompany
          const company = new Company({ rutCompany, nameCompany, sizeCompany, rutManager, nameManager, emailManager, password })

          console.log('dataTemporalCompany', dataTemporalCompany)
          console.log('company', company)

          return await company.save()
          // return dataTemporalCompany;
        }

      } catch (error) {
        console.log(`findOne error--> ${error}`)
        return error;
      }
    }
  },

  Mutation: {
    addTemporalCompany: async (root, args) => {
      const temporalCompany = new TemporalCompany({ ...args })

      // * Validar campos
      const { error } = validateRegister.validate(args, { abortEarly: false })
      if (error) {
        throw new UserInputError('Error al crear una Empresa', {
          error: true,
          message: error.details[0].message
        })
      }

      // * Validar si el correo ya existe
      const existEmail = await TemporalCompany.findOne({ emailManager: temporalCompany.emailManager.toLowerCase() });
      if (existEmail) {
        throw new UserInputError('Email ya registrado', {
          error: true,
          message: 'Email ya registrado'
        })
      }

      // * Hash de password
      const salt = await bcrypt.genSalt(10);
      temporalCompany.password = await bcrypt.hash(temporalCompany.password, salt)

      // * Generar random de 6 dígitos
      temporalCompany.validationCode = gen6digitsNumber();

      return await temporalCompany.save()
    }
  }
};

export default resolvers