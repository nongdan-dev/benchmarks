import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import { promisify } from 'node:util'
import bytes from 'bytes'
import { DockerStats, DockerStatsRaw, WrkStats } from './vite/src/assets'
import path from 'node:path'

const execAsync = promisify(exec)

const names = ['node', 'go', 'rust']
const concurrents = [100, 1000, 10000]

const main = async () => {
  console.log('get cpu info...')
  const cpu = await lscpu()
  console.log(`${cpu.cpu_cores} cores cpu: ${cpu.cpu_info}`)

  console.log(`warm up and check wrk...`)
  await Promise.all(names.map(warmup))

  const duration = 5
  for (const name of names) {
    for (const concurrent of concurrents) {
      const o: WrkOptions = {
        name,
        concurrent,
        duration,
        threads: cpu.cpu_cores,
        script: 'graphql',
      }
      console.log(`${key(o)}...`)
      await Promise.all([wrk(o), usage(o)])
      await merge(o)
    }
  }
}

// warm up to avoid cold start (neu khong biet thi research)
// make sure wrk response correct json with data from database
const warmup = async (name: string) => {
  const r = await _wrk({
    name,
    script: 'graphql-test',
    threads: 1,
    concurrent: 1,
    duration: 1,
  })
  try {
    const i1 = r.stdout.indexOf('{')
    const i2 = r.stdout.lastIndexOf('}')
    const d = JSON.parse(r.stdout.substring(i1, i2 + 1))
    if (d.data.users.length !== 1) {
      throw new Error('d.data.user.length !== 1')
    }
  } catch (err) {
    console.error(`warmup ${name} error:`)
    console.error(err)
    console.error(r.stdout)
    console.error(r.stderr)
    process.exit(1)
  }
}

const usage = (o: WrkOptions) => {
  let resolveFn: Function | undefined = undefined
  const promise = new Promise(r => {
    resolveFn = r
  })

  const promises: Promise<DockerStatsRaw>[] = []
  const callback = async () => {
    const arr = await Promise.all(promises)
    const d: DockerStats = {
      usage_raw: arr,
      ...(null as any),
    }
    await writeAsset(statsFilename(o), d)
    resolveFn?.()
    resolveFn = undefined
  }

  let count = 0
  const id = setInterval(() => {
    if (count > o.duration) {
      clearInterval(id)
      callback()
      return
    }
    promises.push(_usage(o.name))
    count += 1
  }, 1000)

  return promise
}

const _usage = async (name: string) => {
  const { stdout: stats } = await execAsync(
    `docker stats --no-stream --format "{{.CPUPerc}},{{.MemUsage}}" benchmarks-${name}`,
  )
  // get cpu % and ram usage in bytes number
  const statsParts = stats.trim().split(',')
  const cpu = statsParts[0].replace('%', '').trim()
  const ram = statsParts[1].split('/')[0].trim().replace('i', '')
  const ramUsageBytes = bytes(ram) || 0
  const d: DockerStatsRaw = {
    cpu: Number(cpu),
    ram: ramUsageBytes,
    ...(null as any),
  }
  return d
}

type WrkOptions = {
  name: string
  script: string
  threads: number
  concurrent: number
  duration: number
}
const wrk = async (o: WrkOptions) => {
  await _wrk(o)
  const d: WrkStats = await readWrkBenchmark()
  await writeAsset(wrkFilename(o), d)
}
const _wrk = (o: WrkOptions) =>
  execAsync(
    `docker compose exec benchmarks-wrk wrk -t${o.threads} -c${o.concurrent} -d${o.duration}s --latency -s ./scripts/${o.script}.lua http://benchmarks-${o.name}:30000`,
  )

const merge = async (o: WrkOptions) => {
  const k1 = wrkFilename(o)
  const k2 = statsFilename(o)
  const json1 = await readAsset(k1)
  const json2 = await readAsset(k2)
  const promise = writeAsset(key(o), {
    ...json1,
    ...json2,
  })
  const promises = [k1, k2].map(k => path.join(assetsPath, `${k}.json`)).map(p => fs.rm(p))
  promises.push(promise)
  await Promise.all(promises)
}

// cpu % is relative and depends on the host machine
// need to get cpu info to have a better point of view
const lscpu = async () => {
  const { stdout } = await execAsync(`docker compose exec benchmarks-wrk lscpu`)
  let cpu_info = ''
  let cpu_cores = 0
  let cpu_speed = 0
  stdout.split('/n').forEach(line => {
    const m1 = /Model name:\s+(.+)/.exec(line)
    if (m1) {
      cpu_info = m1[1]
    }
    const m2 = /CPU\(s\):\s+(\d+)/.exec(line)
    if (m2) {
      cpu_cores = Number(m2[1])
    }
    const m3 = /CPU MHz:\s+(.+)/.exec(line)
    if (m3) {
      cpu_speed = Number(m3[1])
    }
  })
  const cpu = {
    cpu_info,
    cpu_cores,
    cpu_speed,
  }
  await writeAsset('cpu', cpu)
  return cpu
}

const key = (o: WrkOptions) => `${o.name}_${o.concurrent}`
const wrkFilename = (o: WrkOptions) => `${key(o)}_wrk`
const statsFilename = (o: WrkOptions) => `${key(o)}_stats`

const assetsPath = path.join(__dirname, './vite/src/assets')
const writeAsset = (f: string, d: any) => writeJson(path.join(assetsPath, f), d)
const readAsset = (f: string) => readJson(path.join(assetsPath, f))

const wrkOutputPath = path.join(__dirname, './wrk/output')
const readWrkBenchmark = () => readJson(path.join(wrkOutputPath, 'benchmark'))

const writeJson = (f: string, d: any) => fs.writeFile(`${f}.json`, JSON.stringify(d), 'utf-8')
const readJson = (f: string) => fs.readFile(`${f}.json`, 'utf-8').then(JSON.parse)

main().catch(err => {
  console.error(err)
  process.exit(1)
})
