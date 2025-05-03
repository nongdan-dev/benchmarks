import { makeExecutableSchema } from '@graphql-tools/schema'

const graphqlTypeDefs = `
  type Query {
    users: [User!]!
  }
  type User {
    id: Int!
    name: String!
    email: String!
  }
`

export const createSchema = () => {
  const { resolvers } = process.env.JM
    ? require('./resolvers-jm')
    : require('./resolvers-data-loader')
  return makeExecutableSchema({
    typeDefs: graphqlTypeDefs,
    resolvers,
  })
}
