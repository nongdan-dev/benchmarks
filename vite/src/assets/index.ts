import node_100 from './node_100.json'
import node_1000 from './node_1000.json'
import node_10000 from './node_10000.json'
import go_100 from './go_100.json'
import go_1000 from './go_1000.json'
import go_10000 from './go_10000.json'
import rust_100 from './rust_100.json'
import rust_1000 from './rust_1000.json'
import rust_10000 from './rust_10000.json'
import cpu_json from './cpu.json'
import numbro from 'numbro'
import prettyMs from 'pretty-ms'
import bytes from 'bytes'

export type WrkStats = {
  duration: number
  total_requests: number
  requests_per_second: number
  transfer_per_second: number
  latency_p50: number
  latency_p90: number
  latency_p99: number
  latency_p9999: number
  latency_min: number
  latency_max: number
  latency_avg: number
  requests_per_second_humanized: string
  transfer_per_second_humanized: string
  latency_p50_humanized: string
  latency_p90_humanized: string
  latency_p99_humanized: string
  latency_p9999_humanized: string
  latency_min_humanized: string
  latency_max_humanized: string
  latency_avg_humanized: string
}

export type DockerStats = {
  usage_raw: DockerStatsRaw[]
  cpu_min: number
  cpu_max: number
  cpu_avg: number
  ram_min: number
  ram_max: number
  ram_avg: number
  cpu_min_humanized: string
  cpu_max_humanized: string
  cpu_avg_humanized: string
  ram_min_humanized: string
  ram_max_humanized: string
  ram_avg_humanized: string
}
export type DockerStatsRaw = {
  cpu: number
  ram: number
  ram_humanized: string
}

export type Stats = WrkStats &
  DockerStats & {
    name: string
  }

export type Cpu = {
  cpu_info: string
  cpu_cores: number
  cpu_speed: number
}

export const hNumber = (v: number) =>
  numbro(v).format({
    average: true,
    mantissa: 1,
    optionalMantissa: false,
  })
export const hBytes = (v: number) => bytes(v) as string
export const hBytesYAxis = (v: number) =>
  bytes(v, {
    decimalPlaces: 0,
    thousandsSeparator: ' ',
    unit: 'MB',
  }) as string
export const hNanosecond = (v: number) => {
  if (v === 0) {
    return `0`
  }
  if (v < 1000) {
    return `${v}ns`
  }
  return prettyMs(v / 1000)
}
export const hPercentage = (v: number) => `${v}%`

const addExtra = (name: string, j: Stats) => {
  j.name = name

  j.requests_per_second_humanized = hNumber(j.requests_per_second)
  j.transfer_per_second_humanized = hBytes(j.transfer_per_second)
  j.latency_p50_humanized = hNanosecond(j.latency_p50)
  j.latency_p90_humanized = hNanosecond(j.latency_p90)
  j.latency_p99_humanized = hNanosecond(j.latency_p99)
  j.latency_p9999_humanized = hNanosecond(j.latency_p9999)
  j.latency_min_humanized = hNanosecond(j.latency_min)
  j.latency_max_humanized = hNanosecond(j.latency_max)
  j.latency_avg_humanized = hNanosecond(j.latency_avg)

  j.cpu_min = Math.min(...j.usage_raw.map(v => v.cpu))
  j.cpu_max = Math.max(...j.usage_raw.map(v => v.cpu))
  j.cpu_avg = Number((j.usage_raw.reduce((t, v) => t + v.cpu, 0) / j.usage_raw.length).toFixed(2))
  j.ram_min = Math.min(...j.usage_raw.map(v => v.ram))
  j.ram_max = Math.max(...j.usage_raw.map(v => v.ram))
  j.ram_avg = Math.round(j.usage_raw.reduce((t, v) => t + v.ram, 0) / j.usage_raw.length)

  j.cpu_min_humanized = hPercentage(j.cpu_min)
  j.cpu_max_humanized = hPercentage(j.cpu_max)
  j.cpu_avg_humanized = hPercentage(j.cpu_avg)
  j.ram_min_humanized = hBytes(j.ram_min)
  j.ram_max_humanized = hBytes(j.ram_max)
  j.ram_avg_humanized = hBytes(j.ram_avg)
}

const d: {
  [k: string]: Stats[]
} = {
  node: [node_100, node_1000, node_10000],
  go: [go_100, go_1000, go_10000],
  rust: [rust_100, rust_1000, rust_10000],
} as any

Object.entries(d).forEach(([k, arr]) => {
  arr.forEach(v => addExtra(k, v))
})

export const cpu: Cpu = cpu_json as any
export const stats100 = [node_100, go_100, rust_100] as Stats[]
export const stats1000 = [node_1000, go_1000, rust_1000] as Stats[]
export const stats10000 = [node_10000, go_10000, rust_10000] as Stats[]
