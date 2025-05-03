import fastify from 'fastify'
import { createHandler } from 'graphql-http/lib/use/fastify'

import { httpPort } from '../shared/config'
import { createSchema } from '../shared/graphql'

export const start = () => {
  const app = fastify()
  app.post('/graphql', createHandler({ schema: createSchema() }))

  app.listen({ host: '::', port: httpPort }, err => {
    if (err) {
      console.error(`fastify listen error: ${err}`)
    } else {
      console.log(`fastify listening on port ${httpPort}`)
    }
  })
}
