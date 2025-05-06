// express/fastify
import dotenv from 'dotenv';
import { toBool } from './utils';
import * as path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const { start } = require(`./${process.env.FRAMEWORK}`)

if (toBool(process.env.CLUSTER)) {
  require('./cluster').fork(start)
} else {
  start()
}
// if (process.env.CLUSTER) {
//   require('./cluster').fork(start)
// } else {
//   start()
// }

