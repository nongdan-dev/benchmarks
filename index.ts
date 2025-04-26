import { exec } from 'node:child_process'
import fs from 'node:fs'
import { promisify } from 'node:util'
import bytes from 'bytes'
import prettyMs from 'pretty-ms'
import { cpus } from 'node:os'
import {
  DockerStats,
  DockerStatsRaw,
  WrkOptions,
  WrkStats
} from "./type"

const execAsync = promisify(exec)

const main = async () => {
  // TODO get cpu info  
  // cpu % is relative and depends on the host machine
  // need to get cpu info to have a better point of view
  console.log('CPU Info:', cpus().pop());

  await Promise.all([warmup('node'), warmup('go'), warmup('rust')])

  const d = 10
  await Promise.all([runGraphql('node', d), getCpuRamUsage2('node', d)])
  await Promise.all([runGraphql('go', d), getCpuRamUsage2('go', d)])
  await Promise.all([runGraphql('rust', d), getCpuRamUsage2('rust', d)])
}

// warm up to avoid cold start (neu khong biet thi research)
// make sure wrk response correct json with data from database
const warmup = async (name: string) => {
  const r = await wrk({
    name,
    script: 'graphql-test',
    threads: 1,
    concurrent: 1,
    duration: 1,
  })
  try {
    const i1 = r.stdout.indexOf('{')
    const i2 = r.stdout.lastIndexOf('}')
    const json = JSON.parse(r.stdout.substring(i1, i2 + 1))
    if (json.data.users.length !== 1) {
      throw new Error('json.data.user.length !== 1')
    }
  } catch (err) {
    console.log(err)
    console.log(`failed to get response for ${name}`)
    console.log(r.stdout)
    process.exit(1)
  }
  console.log(`done warm up for ${name}`)
}




const getCpuRamUsage2 = (name: string, total = 30) => {
  let resolveFn: Function | undefined = undefined
  const promise = new Promise(r => {
    resolveFn = r
  })

  const promises: Promise<DockerStatsRaw>[] = []
  const callback = async () => {
    const arr = await Promise.all(promises)
    const json: DockerStats = {
      cpu_min: Math.min(...arr.map(v => v.cpu)),
      cpu_max: Math.max(...arr.map(v => v.cpu)),
      cpu_avg: Number((arr.reduce((t, v) => t + v.cpu, 0) / arr.length).toFixed(2)),
      ram_min: Math.min(...arr.map(v => v.ram)),
      ram_max: Math.max(...arr.map(v => v.ram)),
      ram_avg: Math.round(arr.reduce((t, v) => t + v.ram, 0) / arr.length),
      raw: arr,
    }
    // TODO: humanized can be done on vite code
    json.cpu_min_humanized = `${json.cpu_min}%`
    json.cpu_max_humanized = `${json.cpu_max}%`
    json.cpu_avg_humanized = `${json.cpu_avg}%`
    json.ram_min_humanized = bytes(json.ram_min)
    json.ram_max_humanized = bytes(json.ram_max)
    json.ram_avg_humanized = bytes(json.ram_avg)
    json.cpu_info_humanized = cpus().pop(),

    fs.writeFileSync(`vite/src/assets/${name}_stats.json`, JSON.stringify(json, null, 2), 'utf-8')
    console.log(`done write json docker stats for ${name}`)
    resolveFn?.()
    resolveFn = undefined
  }

  let count = 0
  const id = setInterval(() => {
    if (count > total) {
      clearInterval(id)
      callback()
      return
    }
    promises.push(getCpuRamUsage(name))
    count += 1
  }, 1000)

  return promise
}

const getCpuRamUsage = async (name: string) => {
  const { stdout: stats } = await execAsync(
    `docker stats --no-stream --format "{{.CPUPerc}},{{.MemUsage}}" "benchmarks-${name}"`,
  )
  // get cpu % and ram usage in bytes number
  const statsParts = stats.trim().split(',')
  const cpu = statsParts[0]
  const ram = statsParts[1]
  const ramUsage = ram.split('/')[0].trim().replace('i', '')
  const ramUsageBytes = bytes(ramUsage) || 0
  // TODO: humanized can be done on vite code
  const ram_humanized = bytes(ramUsageBytes) || ''
  const data: DockerStatsRaw = {
    cpu: Number(cpu.replace('%', '')),
    ram: ramUsageBytes,
    ram_humanized,
  }
  return data
}

const runGraphql = async (name: string, duration: number) => {
  console.log(`start running wrk for ${name}....`)
  // TODO research and adjust wrk params to maximize number of concurrent connection
  /**
   * Tips for Maximizing Concurrent Connections
   *      - Increase -c until system limits are reached
   *      - Use more threads(-t), set it close to your number of logical CPU cores
   *      - System tuning: Increase file descriptor limits
   */
  await wrk({
    name,
    duration,
    concurrent: 1200,
    threads:12,
    script: 'graphql',
  })
  const str = fs.readFileSync('wrk/output/benchmark.json', 'utf-8')
  // TODO: humanized can be done on vite code
  const json: WrkStats = JSON.parse(str)
  json.requests_per_second_humanized = bytes(json.requests_per_second)
  json.transfer_per_second_humanized = bytes(json.transfer_per_second)
  json.latency_p50_humanized = humanizeNanosecond(json.latency_p50)
  json.latency_p90_humanized = humanizeNanosecond(json.latency_p90)
  json.latency_p99_humanized = humanizeNanosecond(json.latency_p99)
  json.latency_p9999_humanized = humanizeNanosecond(json.latency_p9999)
  json.latency_min_humanized = humanizeNanosecond(json.latency_min)
  json.latency_max_humanized = humanizeNanosecond(json.latency_max)
  json.latency_avg_humanized = humanizeNanosecond(json.latency_avg)
  json.cpu_info_humanized = cpus().pop()

  fs.writeFileSync(`vite/src/assets/${name}_wrk.json`, JSON.stringify(json, null, 2), 'utf-8')
}


const wrk = async (p: WrkOptions) => {
  const name = p.name
  const script = p.script
  const threads = p.threads || 4
  const concurrent = p.concurrent || 1000
  const duration = p.duration || 60
  return execAsync(
    `docker compose exec benchmarks-wrk wrk -t${threads} -c${concurrent} -d${duration}s --latency -s ./scripts/${script}.lua http://benchmarks-${name}:30000`,
  )
}

const humanizeNanosecond = (ns: number) => {
  if (ns < 1000) {
    return `${ns}ns`
  }
  return prettyMs(ns / 1000)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
