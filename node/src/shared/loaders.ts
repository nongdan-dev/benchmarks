import DataLoader from 'dataloader'
import { Post, User } from './sequelize'

export const createPostLoader = () =>
  new DataLoader(async (userIds: readonly number[]) => {
    const posts = await Post.findAll({ where: { userId: userIds } }).then(arr => arr.map(e => e.toJSON()))

    const postsMap: { [key: number]: any[] } = {}
    posts.forEach((post: any) => {
      if (!postsMap[post.userId]) {
        postsMap[post.userId] = [];
      }
      postsMap[post.userId].push(post);
    });

    return userIds.map((id) => postsMap[id] || [])
  })



export const createUserLoader = () =>
  new DataLoader(async (userIds: readonly number[]) => {
    const users = await User.findAll({
      where: { id: userIds },
    })

    const userMap = new Map<number, typeof users[number]>(
      users.map(user => [user.getDataValue('id'), user])
    )
    
    return userIds.map(id => userMap.get(id))
  })

