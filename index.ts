import bytes from 'bytes'
import { uniq } from 'lodash'
import { exec as execWithCallback } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import type {
  BData,
  Benchmark,
  BSession,
  BUsageRaw,
} from './ui/src/assets/benchmark'

const exec = promisify(execWithCallback)
const duration = 30
const frameworks = [
  // {
  //   platform: 'node',
  //   framework: 'express',
  // },
  // {
  //   platform: 'node',
  //   framework: 'nest',
  // },
  // {
  //   platform: 'node',
  //   framework: 'cluster',
  // },
  {
    platform: 'node',
    framework: 'ultimate',
  },
  {
    platform: 'go',
  },
  {
    platform: 'rust',
  },
].map(f => ({
  ...f,
  framework: f.framework || f.platform,
}))

type Case = Pick<BSession, 'concurrent' | 'wrk2'>
const cases: Case[] = [
  {
    concurrent: 100,
    wrk2: false,
  },
  // {
  //   concurrent: 500,
  //   wrk2: false,
  // },
  {
    concurrent: 1000,
    wrk2: false,
  },
  {
    concurrent: 1000,
    wrk2: true,
  },
  // {
  //   concurrent: 5000,
  //   wrk2: true,
  // },
  // {
  //   concurrent: 10000,
  //   wrk2: true,
  // },
]
const key = (c: Case) =>
  c.wrk2 ? `wrk2 rps=${c.concurrent}` : `wrk concurrent=${c.concurrent}`

const main = async () => {
  console.log('kill all services except wrk...')
  await Promise.all([
    ...uniq(frameworks.map(f => f.platform)).map(async p => exec(`make k${p}`)),
    exec('make rwrk'),
  ])

  const b: Benchmark = {
    duration,
    sessions: cases.map(c => ({
      ...c,
      data: [],
    })),
    ...(null as any),
  }
  const sessionMapData = b.sessions.reduce<Record<string, BData[]>>((m, s) => {
    m[key(s)] = s.data
    return m
  }, {})

  console.log('get cpu info...')
  Object.assign(b, await lscpu())
  console.log(`${b.cpu_cores} cores cpu: ${b.cpu_info}`)

  for (const wrk2 of [false, true]) {
    const concurrents = cases
      .filter(c => c.wrk2 === wrk2)
      .map(c => c.concurrent)

    for (const { platform, framework } of frameworks) {
      console.log(`--- ${framework} start, warm up and check wrk...`)
      await exec(`make r${framework}`)
      await exec(
        `docker exec benchmarks-wrk timeout 30s sh -c 'until nc -z benchmarks-${platform} 30000; do sleep 1; done'`,
      )
      await warmup({ platform, wrk2 })

      for (const concurrent of concurrents) {
        const k = key({ wrk2, concurrent })
        console.log(`${framework} ${k}...`)
        const o: WrkOptions = {
          platform,
          concurrent,
          duration,
          threads: b.cpu_cores,
          script: 'graphql',
          wrk2,
        }
        const [wrk_stats, usage_raw] = await Promise.all([wrk(o), usage(o)])
        sessionMapData[k].push({
          platform,
          framework,
          ...wrk_stats,
          usage_raw,
        })
      }

      console.log(`${framework} kill, prune and cool down...`)
      await exec(`make k${platform}`)
      await new Promise(r => setTimeout(r, 5000))
    }

    await writeAsset('benchmark', b)
  }
}

/*
 * Warm up to avoid cold start
 * Make sure wrk response correct json with data from database
 */
const warmup = async (o: Pick<WrkOptions, 'platform' | 'wrk2'>) => {
  const r = await _wrk({
    ...o,
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
    console.error(`warmup ${o.platform} error:`)
    console.error(err)
    console.error(r.stdout)
    console.error(r.stderr)
    process.exit(1)
  }
}

// read docker usage stats in interval
const usage = async (o: WrkOptions) => {
  let resolveFn: ((arr: BUsageRaw[]) => void) | undefined
  const promise = new Promise<BUsageRaw[]>(r => {
    resolveFn = r
  })
  const promises: Promise<BUsageRaw>[] = []
  let count = 0
  const id = setInterval(() => {
    if (count > o.duration) {
      clearInterval(id)
      Promise.all(promises).then(arr => {
        resolveFn?.(arr)
        resolveFn = undefined
      })
      return
    }
    promises.push(_usage(o.platform))
    count += 1
  }, 1000)
  return promise
}
const _usage = async (name: string) => {
  const { stdout: stats } = await exec(
    `docker stats --no-stream --format "{{.CPUPerc}},{{.MemUsage}}" benchmarks-${name}`,
  )
  // get cpu % and ram usage in bytes number
  let [cpu, ram] = stats.trim().split(',')
  cpu = cpu.replace('%', '').trim()
  ram = ram.split('/')[0].trim().replace('i', '')
  const d: BUsageRaw = {
    cpu: Number(cpu),
    ram: bytes(ram) || 0,
    ...(null as any),
  }
  return d
}

type WrkOptions = Case &
  Pick<Benchmark, 'duration'> &
  Pick<BData, 'platform'> & {
    script: string
    threads: number
  }
const wrk = async (o: WrkOptions) => {
  await _wrk(o)
  return readWrkJson()
}
const _wrk = async (o: WrkOptions) => {
  const cmd = o.wrk2 ? 'wrk2' : 'wrk'
  const t = `-t${o.threads}`
  const d = `-d${o.duration}`
  const c = `-c${o.wrk2 ? 100 : o.concurrent}`
  const r = o.wrk2 ? `-R${o.concurrent}` : ''
  const s = `-s ./scripts/${o.script}.lua`
  const u = `http://benchmarks-${o.platform}:30000`
  return _execWrk(`${cmd} ${t} ${d} ${c} ${r} --latency ${s} ${u}`)
}
const _execWrk = (cmd: string) => exec(`docker exec benchmarks-wrk ${cmd}`)

/*
 * Cpu % is relative and depends on the host machine
 * Need to get cpu info to have a better point of view
 */
const lscpu = async () => {
  const { stdout } = await exec('docker exec benchmarks-wrk lscpu')
  let cpu_cores = 0
  let cpu_info = ''
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
  return {
    cpu_info,
    cpu_cores,
    cpu_speed,
  }
}

const assetsPath = path.join(__dirname, './ui/src/assets')
const writeAsset = async (f: string, d: any) =>
  writeJson(path.join(assetsPath, f), d)

const wrkOutputPath = path.join(__dirname, './wrk/output')
const readWrkJson = async () => readJson(path.join(wrkOutputPath, 'benchmark'))

const writeJson = async (f: string, d: any) => {
  f = `${f}.json`
  await fs.writeFile(f, JSON.stringify(d), 'utf-8')
  await exec(`prettier --write ${f}`)
}
const readJson = async (f: string) =>
  fs.readFile(`${f}.json`, 'utf-8').then(JSON.parse)

main().catch(err => {
  console.error(err)
  process.exit(1)
})
