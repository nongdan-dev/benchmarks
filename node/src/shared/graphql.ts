const graphqlTypeDefs = `
  type Mutation {
  createPost(input: CreatePostInput!): Post!
}

input CreatePostInput {
  title: String!
  description: String!
  content: String!
  userId: ID!
}

type Query {
  posts: [Post!]!
  users: [User!]!
}

type Post {
  id: Int!
  title: String!
  description: String!
  content: String!
  user: User!
}

type User {
  id: Int!
  name: String!
  email: String!
  posts: [Post!]!
}
`












import { glob } from 'glob'
import path from 'path'
import { importSchema } from 'graphql-import'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { toBool } from '../utils'
import { resolvers } from './resolvers-data-loader'


export const createSchema = () => {
  const files = glob.sync('./graphql/**/*.graphql', {
    cwd: path.resolve(__dirname, '..'), // Từ src/
    absolute: true,
  });

  const typeDefs = mergeTypeDefs(files.map((filePath) => importSchema(filePath)));

  const resolver = toBool(process.env.JM)
  ? require('./resolvers-jm')
  : resolvers;
    
  return makeExecutableSchema({
    typeDefs,
    resolvers: resolver,
  });
};


  // code ban đầu
  // const resolvers = process.env.JM
  //   ? require('./resolvers-jm')
  //   : require('./resolvers-data-loader');