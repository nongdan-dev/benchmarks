import ultimateExpress from 'ultimate-express'

import { startExpress, User } from '../express/shared'

const resolversWithJm = {
  Query: {
    users: async () => {
      // TODO: jm
      const users = await User.findAll()
      return users
    },
  },
}

export const start = () => startExpress(ultimateExpress, resolversWithJm)
