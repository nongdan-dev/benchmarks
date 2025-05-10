import { makeExecutableSchema } from '@graphql-tools/schema'

import { models } from '../db/models'

const typeDefs = `
type Query {
  posts: [Post!]!
}
type User {
  id: ID!
  email: String!
  name: String!
}
type Post {
  id: ID!
  title: String!
  content: String!
  authorId: ID!
  author: User!
}
`
const resolvers = {
  Query: {
    posts: (parent, context, args, info) => models.Post.findAll(),
  },
  Post: {
    author: (parent, context, args, info) =>
      // TODO: n+1 query
      models.User.findByPk(parent.authorId),
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
