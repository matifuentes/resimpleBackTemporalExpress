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

  type ReturnMatch {
    match: Boolean, 
    trying: Int 
  }

  type Company {
    _id: ID!
    rutCompany: String
    nameCompany: String
    sizeCompany: String

  }

  type User {
    rutManager: String
    nameManager: String
    emailManager: String
    password: String
  }

  type Query {
    companyCount: Int!
    allCompanies: [Company]!
    findCompany(nameCompany: String!): [Company]
    validateCode(emailManager: String!, validationCode: String!): ReturnMatch
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