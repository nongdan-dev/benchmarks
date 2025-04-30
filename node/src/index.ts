// express/nest/ultimate
const { start } = require(`./${process.env.PLATFORM}`)

if (process.env.CLUSTER) {
  require('./cluster').fork(start)
} else {
  start()
}
