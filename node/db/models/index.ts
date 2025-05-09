import { PostModel } from './post'
import { UserModel } from './user'

export const models = {
  User: UserModel,
  Post: PostModel,
}

// TODO: associations should be in the corresponding file
PostModel.belongsTo(models.User, {
  foreignKey: 'authorId',
  as: 'author',
})
