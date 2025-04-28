import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import bytes from 'bytes'

import nodePerf from '../../assets/node_wrk.json'
import goPerf   from '../../assets/go_wrk.json'
import rustPerf from '../../assets/rust_wrk.json'

export default function PerformanceByLangChart() {
  const data = [
    {
      name: 'Node',
      // total_requests: nodePerf.total_requests,
      requests_per_second: nodePerf.requests_per_second,
      // transfer_per_second: nodePerf.transfer_per_second,
      latency_p50: nodePerf.latency_p50,
      latency_p90: nodePerf.latency_p90,
      latency_p99: nodePerf.latency_p99,
      latency_p9999: nodePerf.latency_p9999,
      latency_avg: nodePerf.latency_avg
    },
    {
      name: 'Golang',
      // total_requests: goPerf.total_requests,
      requests_per_second: goPerf.requests_per_second,
      // transfer_per_second: goPerf.transfer_per_second,
      latency_p50: goPerf.latency_p50,
      latency_p90: goPerf.latency_p90,
      latency_p99: goPerf.latency_p99,
      latency_p9999: goPerf.latency_p9999,
      latency_avg: goPerf.latency_avg
    },
    {
      name: 'Rust',
      // total_requests: rustPerf.total_requests,
      requests_per_second: rustPerf.requests_per_second,
      // transfer_per_second: rustPerf.transfer_per_second,
      latency_p50: rustPerf.latency_p50,
      latency_p90: rustPerf.latency_p90,
      latency_p99: rustPerf.latency_p99,
      latency_p9999: rustPerf.latency_p9999,
      latency_avg: rustPerf.latency_avg
    },
  ]

  return (
    <div className="p-5 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Hiệu suất theo ngôn ngữ</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />

          <XAxis dataKey="name" />

          <YAxis
            yAxisId="left"
            orientation="left"
            width={80}
            label={{
              value: 'Latency (ms)',
              angle: -90,
              position: 'insideLeft',
              dy: 15,
              style: { fontWeight: 'bold' },
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            width={60}
            label={{
              value: 'Requests (RPS)',
              angle: 90,
              position: 'insideRight',
              dy: -10,
              style: { fontWeight: 'bold' },
            }}
            tickFormatter={(val) =>
              val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
            }
          />


          <Tooltip
            formatter={(value, name) => {
              const key = name.toString()
              if (key === 'Transfer Per Second')
                return [bytes(Number(value)) + '/s', key]
              if (key.includes('Requests')) {
                if (key === 'Total Requests') return [value + ' requests', key]
                if (key === 'Requests Per Second') return [value + ' RPS', key]
              }
              return [`${value} ms`, key]
            }}
          />

          <Legend />

          {/* Bar cho các mức latency */}
          <Bar
            yAxisId="left"
            dataKey="latency_avg"
            name="Latency Avg"
            barSize={20}
            fill="#00c0ff"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="requests_per_second"
            name="Requests Per Second"
            stroke="#82ca9d"
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
