import { Post as TPost, Resolvers, } from '../graphql/graphql';
import { Post, User } from './sequelize';
import type { GraphQLContext } from './context';
import { email } from '../seed';

export const resolvers: Resolvers<GraphQLContext> = {
  Query: {
    users: async () => {
      const users = await User.findAll().then(arr => arr.map(e => e.toJSON()));
      return users.map(user => {
        return {
          ...user,
          posts: user.posts ?? [],
        }
      });
    },
    
    

    posts: async () => {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'user',
            where: {
              email: email,
            },
          },
        ],
      }).then(arr => arr.map(e => e.toJSON()));

      return posts.map(post => {
        return{
          ...post,
          __typename: 'Post',
        }
      });
    },
  },
  Post: {
    user: async (post, _, { loaders }) => {
      return loaders.userLoader.load(post.user.id);
    },
  },
  User: {
    posts: async (user, _, { loaders }) => {
      return loaders.postLoader.load(user.id);
    },
  },

  Mutation: {
    createPost: async (_, { input }) => {
      const newPost = await Post.create({...input, userId: Number(input.userId)});
      return {
        ...newPost.toJSON(),
        __typename: 'Post',
      };
    },
  },

};
