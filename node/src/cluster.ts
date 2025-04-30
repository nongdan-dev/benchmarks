import cluster from 'node:cluster'
import os from 'node:os'

export const fork = (start: Function) => {
  if (!cluster.isPrimary) {
    start()
    return
  }
  const n = os.availableParallelism()
  for (let i = 0; i < n; i++) {
    cluster.fork()
  }
  cluster.on('exit', worker => {
    cluster.fork()
  })
}
