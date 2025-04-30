import { makeExecutableSchema } from '@graphql-tools/schema'
import type { IResolvers } from '@graphql-tools/utils/typings/Interfaces'
import type { Express } from 'express'
import { createHandler } from 'graphql-http/lib/use/express'
import type { Model } from 'sequelize'
import { DataTypes, Sequelize } from 'sequelize'

import { httpPort } from '../config'

// environment variables will be passed directly in docker-compose.yml
const host = process.env.POSTGRES_HOST
const port = Number(process.env.POSTGRES_PORT)
const username = process.env.POSTGRES_USER
const password = process.env.POSTGRES_PASSWORD
const database = process.env.POSTGRES_DB

export const sequelize = new Sequelize({
  host,
  port,
  username,
  password,
  database,
  dialect: 'postgres',
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
  },
})

type UserAttrs = {
  id: number
  name: string
  email: string
}
export const User = sequelize.define<Model<UserAttrs, UserAttrs>>('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
})

// TODO: another model relationship to enable the n+1 query

export const graphqlTypeDefs = `
  type Query {
    users: [User!]!
  }
  type User {
    id: Int!
    name: String!
    email: String!
  }
`

export const startExpress = (express: any, resolvers: IResolvers) => {
  const app: Express = express()
  app.use(express.json())
  const schema = makeExecutableSchema({
    typeDefs: graphqlTypeDefs,
    resolvers,
  })
  app.use('/graphql', createHandler({ schema }))
  app.listen(httpPort, err => {
    if (err) {
      console.error(`express listen error: ${err}`)
    } else {
      console.log(`express listening on port ${httpPort}`)
    }
  })
}
