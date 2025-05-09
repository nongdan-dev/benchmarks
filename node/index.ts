import 'dotenv/config'

import express from 'express'

import { graphqlHandler } from './graphql'
import { graphqlHandler2 } from './graphql-sdl'
import { restfulHandler } from './restful'

const app = express()
app.use(express.json())

app.get('/api/posts', restfulHandler)
app.use('/api/graphql', graphqlHandler)
app.use('/api/graphql2', graphqlHandler2)

const port = 30000
app.listen(port, () => console.log(`listening on port ${port}`))
