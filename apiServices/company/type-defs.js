import { gql } from 'apollo-server'

const typeDefs = gql`
  type TemporalCompany {
    _id: ID!
    rutCompany: String
    nameCompany: String
    sizeCompany: String
    rutManager: String
    nameManager: String
    emailManager: String
    validationCode: String
    trying: Int
  }

  type Company {
    _id: ID!
    rutCompany: String
    nameCompany: String
    sizeCompany: String
  }

  type User {
    _id: ID!
    rutManager: String
    nameManager: String
    emailManager: String
    password: String
  }

  type UserCompany {
    _id: ID!
    idUser: String
    idCompany: String
  }

  type ReturnMatch {
    match: Boolean
    trying: Int 
  }

  type ReturnLogin {
    token: String!
  }

  type Query {
    companyCount: Int!
    allCompanies: [Company]!
    findCompany(nameCompany: String!): [Company]
    validateCode(emailManager: String!, validationCode: String!): ReturnMatch
    login(emailManager: String!, password: String!): ReturnLogin
  }

  type Mutation {
    addTemporalCompany(
      rutCompany: String
      nameCompany: String
      sizeCompany: String
      rutManager: String
      nameManager: String
      emailManager: String
      password: String
    ): TemporalCompany
  }
`

export default typeDefs