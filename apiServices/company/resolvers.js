import TemporalCompany from './models/TemporalCompany.js'
import Company from './models/Company.js'
import User from './models/User.js'
import UserCompany from './models/User-Company.js'
import BaseLine from './models/Base-Line.js'
import { } from '../../db.js'
import bcrypt from 'bcrypt'
import { validateRegister, validateLogin } from './validations/company.js'
import jwt from 'jsonwebtoken'
import gen6digitsNumber from './utils.js'

const resolvers = {
  Query: {
    companyCount: async (root, args, { user }) => {
      try {
        if (!user) throw new Error('Usuario no autenticado')

        return Company.collection.countDocuments()
      } catch (error) {
        return error
      }
    },
    allCompanies: async (root, args, { user }) => {
      try {
        if (!user) throw new Error('Usuario no autenticado')

        return Company.find({})
      } catch (error) {
        return error
      }
    },
    findCompany: async (root, args) => {
      const { nameCompany } = args
      return TemporalCompany.find({ nameCompany })
    },
    companiesByUser: async (root, args) => {
      const { idUser } = args

      const arrCompaniesByUser = await UserCompany.find({ idUser });

      const arrIdsCompanies = arrCompaniesByUser.map(company =>
        company.idCompany
      );

      const arrCompanies = await Company.find({ _id: { $in: arrIdsCompanies } });

      return arrCompanies
    },
    validateCode: async (root, args) => {
      const { emailManager, validationCode } = args

      try {
        const dataTemporalCompany = await TemporalCompany.findOne({ emailManager: emailManager.toLowerCase() })
        if (!dataTemporalCompany) {
          throw new Error('Email no encontrado')
        }

        if (dataTemporalCompany.trying == 0) {
          throw new Error('No tienes más intentos disponibles');
        }

        if (validationCode !== dataTemporalCompany.validationCode) {
          const tries = dataTemporalCompany.trying > 0 ? dataTemporalCompany.trying - 1 : dataTemporalCompany.trying
          const filter = { _id: dataTemporalCompany._id }
          const update = { trying: tries }

          await TemporalCompany.findOneAndUpdate(filter, update, {
            returnOriginal: false
          })

          return {
            match: false,
            trying: tries
          };
        } else {

          // * La data coincide, realizo una inserción en la tabla Company

          const { rutCompany, nameCompany, sizeCompany, rutManager, nameManager, emailManager, password } = dataTemporalCompany
          const company = new Company({ rutCompany, nameCompany, sizeCompany })
          const user = new User({ rutManager, nameManager, emailManager: emailManager.toLowerCase(), password })

          const existEmailUser = await User.findOne({ emailManager: emailManager.toLowerCase() })
          if (existEmailUser) {
            throw new Error('El email ya está registrado')
          }

          // * Creaación de User y Company y User-Company
          const newUser = await user.save()
          const newCompany = await company.save()

          if (newCompany && newUser) {
            // * Borrar registro en Temporal Company
            const deleteFilter = { _id: dataTemporalCompany._id }
            await TemporalCompany.deleteOne(deleteFilter)

            // * Creación en User-Company
            const userCompany = new UserCompany({ idUser: newUser._id, idCompany: newCompany._id })

            await userCompany.save()

            // * Retornar nuevo registro en User
            return {
              match: true,
              trying: 0
            }
          }
        }

      } catch (error) {
        return error
      }
    },
    login: async (root, args) => {
      const { emailManager, password } = args

      try {
        // * Validar campos
        const { error } = validateLogin.validate(args, { abortEarly: false })
        if (error) {
          throw new Error(error.details[0].message)
        }

        // * Validar que el correo exista en User
        const user = await User.findOne({ emailManager: emailManager.toLowerCase() })
        if (!user) {
          throw new Error('Credenciales inválidas')
        }

        // * Validar password
        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
          throw new Error('Credenciales inválidas')
        }

        // * Creación del JWT
        const token = jwt.sign({
          id: user._id,
          rutManager: user.rutManager,
          nameManager: user.nameManager,
          emailManager: user.emailManager
        }, process.env.TOKEN_SECRET);

        return {
          token: token
        }

      } catch (error) {
        return error
      }
    }
  },

  Mutation: {
    addBaseLine: async (root, args) => {
      const baseLine = new BaseLine({ ...args })

      return await baseLine.save()
    },
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
        throw new Error('Email ya registrado')
      }

      // * Validar si el correo ya existe en Company
      const existEmailCompany = await Company.findOne({ emailManager: temporalCompany.emailManager.toLowerCase() })
      if (existEmailCompany) {
        throw new Error('Email ya registrado')
      }

      // * Hash de password
      const salt = await bcrypt.genSalt(10);
      temporalCompany.password = await bcrypt.hash(temporalCompany.password, salt)

      // * Generar random de 6 dígitos
      temporalCompany.validationCode = gen6digitsNumber();

      // * Guardar el email en minúscula
      temporalCompany.emailManager = temporalCompany.emailManager.toLowerCase();

      return await temporalCompany.save()
    }
  }
};

export default resolvers