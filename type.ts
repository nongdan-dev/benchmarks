import { CpuInfo } from 'node:os'


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
  // extra
  requests_per_second_humanized?: string | null
  transfer_per_second_humanized?: string | null
  latency_p50_humanized?: string | null
  latency_p90_humanized?: string | null
  latency_p99_humanized?: string | null
  latency_p9999_humanized?: string | null
  latency_min_humanized?: string | null
  latency_max_humanized?: string | null
  latency_avg_humanized?: string | null
  cpu_info_humanized?: CpuInfo | undefined
}

export type DockerStats = {
  cpu_min: number
  cpu_max: number
  cpu_avg: number
  ram_min: number
  ram_max: number
  ram_avg: number
  cpu_min_humanized?: string | null
  cpu_max_humanized?: string | null
  cpu_avg_humanized?: string | null
  ram_min_humanized?: string | null
  ram_max_humanized?: string | null
  ram_avg_humanized?: string | null
  raw: DockerStatsRaw[]
  cpu_info_humanized?: CpuInfo | undefined
}
export type DockerStatsRaw = {
  cpu: number
  ram: number
  ram_humanized: string
}

export type WrkOptions = {
  name: string
  script: string
  threads?: number
  concurrent?: number
  duration?: number
}