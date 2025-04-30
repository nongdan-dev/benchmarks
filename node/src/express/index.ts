import express from 'express'

import { startExpress, User } from './shared'

const resolversWithDataLoader = {
  Query: {
    users: async () => {
      // TODO: data loader
      const users = await User.findAll()
      return users
    },
  },
}

export const start = () => startExpress(express, resolversWithDataLoader)
