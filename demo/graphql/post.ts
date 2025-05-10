import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { models } from '../db/models'
import { UserType } from './user'

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: (parent, context, args, info) =>
        // TODO: n+1 query
        models.User.findByPk(parent.authorId),
    },
  },
})
