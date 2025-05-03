import { User } from './sequelize'

export const resolvers = {
  Query: {
    users: async () => {
      // TODO: data loader to solve n+1 query
      const users = await User.findAll()
      return users
    },
  },
}
