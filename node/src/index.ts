import express, { Request, Response } from 'ultimate-express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { sequelize } from './db'
import { userResolvers } from './resolvers/user.resolver'
import { userTypeDefs } from './schema/user.schema'
import { User } from './models/User'

import cluster from 'node:cluster'
import os from 'node:os'

const PORT = 30000
const numCPUs = os.availableParallelism()

const createServer = async () => {
  const app = express()
  app.use(express.json())

  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
  })

  await server.start()
  app.use('/graphql', expressMiddleware(server))

  app.get('/users', async (_req: Request, res: Response) => {
    const user = await User.findAll().then(arr => arr.map(e => e.toJSON()))
    return res.status(200).json(user)
  })

  app.post('/create', async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing params' })
    }
    const user = await User.create({ name, email, password }).then(v => v.toJSON())
    return res.status(200).json(user)
  })

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on http://localhost:${PORT}`)
    console.log(`GraphQL: http://localhost:${PORT}/graphql`)
  })
}

const startCluster = async () => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    await sequelize.authenticate()
    await sequelize.sync({ alter: true })

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

    cluster.on('exit', worker => {
      console.log(`Worker ${worker.process.pid} died. Forking a new one...`)
      cluster.fork()
    })
  } else {
    createServer().catch(err => {
      console.error(`Error in worker ${process.pid}`, err)
    })
  }
}

startCluster().catch(err => {
  console.error('Failed to start cluster:', err)
})
