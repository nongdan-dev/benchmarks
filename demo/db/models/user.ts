import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'

import { sequelize } from '../sequelize'

export const UserModel = sequelize.define<Model<User, UserCreate>>('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

export type User = {
  id: number
  email: string
  name: string
}
export type UserCreate = {
  // TODO:
}
