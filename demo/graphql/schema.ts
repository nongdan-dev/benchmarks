import { GraphQLSchema } from 'graphql'

import { QueryType } from './query'

export const schema = new GraphQLSchema({
  query: QueryType,
})
