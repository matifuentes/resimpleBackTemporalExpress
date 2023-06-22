import TemporalCompany from './models/TemporalCompany.js'
import Company from './models/Company.js'
import User from './models/User.js'
import { } from '../../db.js'
import bcrypt from 'bcrypt'
import { validateRegister, validateLogin } from './validations/company.js'
import jwt from 'jsonwebtoken'
//import { UserInputError } from 'apollo-server'
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
          throw new Error('Email no encontrado en Temporal Company')
        }

        if (dataTemporalCompany.trying == 0) {
          throw new Error('No tienes más intentos disponibles');
        }

        if (validationCode !== dataTemporalCompany.validationCode) {
          const tries = dataTemporalCompany.trying > 0 ? dataTemporalCompany.trying - 1 : dataTemporalCompany.trying
          const filter = { _id: dataTemporalCompany._id }
          const update = { trying: tries }
          const updatedTemporalCompany = await TemporalCompany.findOneAndUpdate(filter, update, {
            returnOriginal: false
          })

          return {
            match: false,
            trying: tries
          };

          //return updatedTemporalCompany;
        } else {

          // * La data coincide, realizo una inserción en la tabla Company

          const { rutCompany, nameCompany, sizeCompany, rutManager, nameManager, emailManager, password } = dataTemporalCompany
          const company = new Company({ rutCompany, nameCompany, sizeCompany })
          const user = new User({ rutManager, nameManager, emailManager, password })

          const existEmailUser = await User.findOne({ emailManager })
          if (existEmailUser) {
            throw new Error('El email ya existe en User')
          }

          const newUser = await user.save()
          const newCompany = await company.save()

          if (newCompany && newUser) {
            // * Borrar registro en Temporal Company
            const deleteFilter = { _id: dataTemporalCompany._id }
            await TemporalCompany.deleteOne(deleteFilter)

            // * Retornar nuevo registro en User
            return {
              match: true,
              trying: 0
            };
            //return newUser
          }
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
        throw new Error(error.details[0].message)
      }

      // * Validar si el correo ya existe en Temporal Company
      const existEmailTemporalCompany = await TemporalCompany.findOne({ emailManager: temporalCompany.emailManager.toLowerCase() });
      if (existEmailTemporalCompany) {
        throw new Error('Email ya registrado en Temporal Company')
      }

      // * Validar si el correo ya existe en Company
      const existEmailCompany = await Company.findOne({ emailManager: temporalCompany.emailManager.toLowerCase() })
      if (existEmailCompany) {
        throw new Error('Email ya registrado en Company')
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