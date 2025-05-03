import express from 'express'
import { createHandler } from 'graphql-http/lib/use/express'

import { httpPort } from '../shared/config'
import { createSchema } from '../shared/graphql'

export const start = () => {
  const app = express()
  app.use(express.json())
  app.post('/graphql', createHandler({ schema: createSchema() }))

  app.listen(httpPort, err => {
    if (err) {
      console.error(`express listen error: ${err}`)
    } else {
      console.log(`express listening on port ${httpPort}`)
    }
  })
}
