import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { models } from '../db/models'
import { PostType } from './post'

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (parent, context, args, info) => models.Post.findAll(),
    },
  },
})
