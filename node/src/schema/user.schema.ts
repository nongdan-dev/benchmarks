// src/schema/user.schema.ts
import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): User!
  }
`;
