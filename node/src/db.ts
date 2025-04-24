import { Sequelize } from 'sequelize'

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
})
