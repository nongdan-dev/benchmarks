import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { BData } from '@/assets/benchmark'
import { colors, lineColor } from '@/components/colors'
import { hNanosecond, hNumber } from '@/utils/humanize'

export const Latency = ({ data }: { data: BData[] }) => (
  <div className='w-[600px] rounded p-5 shadow'>
    <ResponsiveContainer
      height={400}
      width='100%'
    >
      <ComposedChart data={data}>
        <defs>
          {[['black', 'black'], ...Object.entries(colors)].map(([k, v]) => (
            <pattern
              height='40'
              id={`striped-${k}`}
              key={k}
              patternTransform='rotate(40)'
              patternUnits='userSpaceOnUse'
              width='40'
            >
              <rect
                fill={v}
                height='40'
                width='40'
              />

              <line
                stroke='rgba(255, 255, 255, 0.3)'
                strokeWidth='30'
                x1='0'
                x2='40'
                y1='0'
                y2='0'
              />
            </pattern>
          ))}
        </defs>

        <CartesianGrid stroke='#f5f5f5' />

        <XAxis dataKey='framework' />

        <YAxis
          orientation='left'
          tickFormatter={hNanosecond}
          width={80}
          yAxisId='left'
        />

        <YAxis
          orientation='right'
          tickFormatter={hNumber}
          width={80}
          yAxisId='right'
        />

        <Tooltip
          formatter={(_, name, item) => [
            item.payload[`${item.dataKey}_humanized`],
            name,
          ]}
        />

        <Legend />

        <Bar
          barSize={20}
          dataKey='latency_p99'
          name='p99'
          yAxisId='left'
        >
          {data.map((e, i) => (
            <Cell
              fill={colors[e.platform]}
              key={i}
            />
          ))}
        </Bar>

        <Bar
          barSize={20}
          dataKey='latency_tm99'
          fill='url(#striped-black)'
          name='tm99'
          yAxisId='left'
        >
          {data.map((e, i) => (
            <Cell
              fill={`url(#striped-${e.platform})`}
              key={i}
            />
          ))}
        </Bar>

        <Line
          dataKey='requests_per_second'
          name='rps'
          stroke={lineColor}
          strokeWidth={2}
          type='monotone'
          yAxisId='right'
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
)
