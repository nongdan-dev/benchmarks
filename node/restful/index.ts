import type { Request, Response } from 'express'

import { models } from '../db/models'

export const restfulHandler = async (req: Request, res: Response) => {
  const posts = await models.Post.findAll({
    include: {
      model: models.User,
      as: 'author',
    },
  })
  res.json({ data: posts })
}
