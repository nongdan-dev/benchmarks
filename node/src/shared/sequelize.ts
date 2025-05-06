import type { Model } from 'sequelize'
import { DataTypes, Sequelize } from 'sequelize'

// environment variables will be passed directly in docker-compose.yml

const host = 'localhost'
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

export type UserAttrs = {
  id: number
  name: string
  email: string
  posts?: []
}

type UserCreationAttrs = Omit<UserAttrs, 'id'>


export const User = sequelize.define<Model<UserAttrs, UserCreationAttrs>>('user', {
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

export type PostAttrs = {
  id: number
  userId: number
  title: string
  description: string
  content: string
  user?: UserAttrs
}

type PostCreationAttrs = Omit<PostAttrs, 'id'>

export const Post = sequelize.define<Model<PostAttrs, PostCreationAttrs>>('post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})


Post.belongsTo(User, {
  foreignKey: 'userId',
  // as: 'user',
})
