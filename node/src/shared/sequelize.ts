import type { Model } from 'sequelize'
import { DataTypes, Sequelize } from 'sequelize'

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
    timestamps: false,
  },
})

// TODO: add relationship to enable the n+1 query

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
