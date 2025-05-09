import 'dotenv/config'

import { faker } from '@faker-js/faker'

import { models } from './models'
import type { Post } from './models/post'
import type { User } from './models/user'
import { sequelize } from './sequelize'

const seed = async () => {
  await sequelize.sync({ force: true })
  const nUsers = 3
  const nPosts = 10

  const users: User[] = []
  for (let i = 1; i <= nUsers; i++) {
    users.push({
      id: i,
      name: faker.book.author(),
      email: faker.internet.email(),
    })
  }

  const posts: Post[] = []
  for (let i = 1; i <= nPosts; i++) {
    posts.push({
      id: i,
      authorId: (i % nUsers) + 1,
      title: faker.book.title(),
      content: faker.lorem.paragraph(),
    })
  }

  await Promise.all([
    models.User.bulkCreate(users),
    models.Post.bulkCreate(posts),
  ])
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
