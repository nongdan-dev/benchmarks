import express from 'express'
import { createHandler } from 'graphql-http/lib/use/express'

import { httpPort } from '../shared/config'
import { createSchema } from '../shared/graphql'
import { context } from '../shared/context'
import { sequelize } from '../shared/sequelize'
import { seedAdmin } from '../seed'

export const start = () => {
  const app = express()
  app.use(express.json())
  // app.post('/graphql', createHandler({ schema: createSchema() }))
  // sequelize.sync({alter: true})
  seedAdmin()
  app.post(
    '/graphql',
    createHandler({
      schema: createSchema(),
      context: () => context(),
    })
  )


  app.listen(httpPort, err => {
    if (err) {
      console.error(`express listen error: ${err}`)
    } else {
      console.log(`express listening on port ${httpPort}`)
    }
  })
}
