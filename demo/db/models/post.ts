import type { Model } from 'sequelize'
import { DataTypes } from 'sequelize'

import { sequelize } from '../sequelize'

export const PostModel = sequelize.define<Model<Post, PostCreate>>('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

export type Post = {
  id: number
  title: string
  content: string
  authorId: number
}
export type PostCreate = {
  // TODO:
}
