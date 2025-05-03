// express/fastify
const { start } = require(`./${process.env.FRAMEWORK}`)

if (process.env.CLUSTER) {
  require('./cluster').fork(start)
} else {
  start()
}
