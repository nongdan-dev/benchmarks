import benchmark_json from '@/assets/benchmark.json'
import { hBytes, hNanosecond, hNumber, hPercentage } from '@/utils/humanize'

export const benchmark: Benchmark = benchmark_json as any

benchmark.sessions.forEach(s => {
  s.data.forEach(d => {
    d.requests_per_second_humanized = hNumber(d.requests_per_second)
    d.transfer_per_second_humanized = hBytes(d.transfer_per_second)
    d.latency_p50_humanized = hNanosecond(d.latency_p50)
    d.latency_p90_humanized = hNanosecond(d.latency_p90)
    d.latency_p99_humanized = hNanosecond(d.latency_p99)
    d.latency_p9999_humanized = hNanosecond(d.latency_p9999)
    d.latency_tm99_humanized = hNanosecond(d.latency_tm99)
    d.latency_tm999_humanized = hNanosecond(d.latency_tm999)
    d.latency_tm9999_humanized = hNanosecond(d.latency_tm9999)
    d.latency_min_humanized = hNanosecond(d.latency_min)
    d.latency_max_humanized = hNanosecond(d.latency_max)
    d.latency_avg_humanized = hNanosecond(d.latency_avg)

    d.cpu_min = Math.min(...d.usage_raw.map(v => v.cpu))
    d.cpu_max = Math.max(...d.usage_raw.map(v => v.cpu))
    d.cpu_avg = Number(
      (d.usage_raw.reduce((t, v) => t + v.cpu, 0) / d.usage_raw.length).toFixed(
        2,
      ),
    )
    d.ram_min = Math.min(...d.usage_raw.map(v => v.ram))
    d.ram_max = Math.max(...d.usage_raw.map(v => v.ram))
    d.ram_avg = Math.round(
      d.usage_raw.reduce((t, v) => t + v.ram, 0) / d.usage_raw.length,
    )

    d.cpu_min_humanized = hPercentage(d.cpu_min)
    d.cpu_max_humanized = hPercentage(d.cpu_max)
    d.cpu_avg_humanized = hPercentage(d.cpu_avg)
    d.ram_min_humanized = hBytes(d.ram_min)
    d.ram_max_humanized = hBytes(d.ram_max)
    d.ram_avg_humanized = hBytes(d.ram_avg)
  })
})

export interface Benchmark {
  cpu_info: string
  cpu_cores: number
  cpu_speed: number

  duration: number
  sessions: BSession[]
}
export interface BSession {
  concurrent: number
  wrk2: boolean
  data: BData[]
}

export interface BData {
  // node/go/rust...
  platform: string

  // eg: node can be express/nest/cluster/ultimate...
  framework: string

  duration: number
  total_requests: number

  total_errors: number
  errors_connect: number
  errors_read: number
  errors_write: number
  errors_status: number
  errors_timeout: number

  requests_per_second: number
  transfer_per_second: number
  latency_p50: number
  latency_p90: number
  latency_p99: number
  latency_p9999: number
  latency_tm99: number
  latency_tm999: number
  latency_tm9999: number
  latency_min: number
  latency_max: number
  latency_avg: number
  requests_per_second_humanized: string
  transfer_per_second_humanized: string
  latency_p50_humanized: string
  latency_p90_humanized: string
  latency_p99_humanized: string
  latency_p9999_humanized: string
  latency_tm99_humanized: string
  latency_tm999_humanized: string
  latency_tm9999_humanized: string

  latency_min_humanized: string
  latency_max_humanized: string
  latency_avg_humanized: string
  latency_stdev: number

  usage_raw: BUsageRaw[]
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

export interface BUsageRaw {
  cpu: number
  ram: number
  ram_humanized: string
}
