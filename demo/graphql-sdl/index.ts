import { createHandler } from 'graphql-http/lib/use/express'

import { schema } from './schema'

export const graphqlHandler2 = createHandler({ schema })
