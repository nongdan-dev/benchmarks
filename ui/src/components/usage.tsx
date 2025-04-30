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
import { hBytesYAxis, hPercentage } from '@/utils/humanize'

export const Usage = ({ data }: { data: BData[] }) => (
  <div className='w-[500px] rounded p-5 shadow'>
    <ResponsiveContainer
      height={400}
      width='100%'
    >
      <ComposedChart data={data}>
        <CartesianGrid stroke='#f5f5f5' />

        <XAxis dataKey='name' />

        <YAxis
          orientation='left'
          tickFormatter={hPercentage}
          width={80}
          yAxisId='left'
        />

        <YAxis
          orientation='right'
          tickFormatter={hBytesYAxis}
          width={80}
          yAxisId='right'
        />

        <Tooltip
          formatter={(_, name, item) => {
            const { payload, dataKey } = item

            return [payload[`${dataKey}_humanized`], name]
          }}
        />

        <Legend />

        <Bar
          barSize={20}
          dataKey='cpu_avg'
          name='cpu'
          yAxisId='left'
        >
          {data.map((e, i) => (
            <Cell
              fill={colors[e.name]}
              key={i}
            />
          ))}
        </Bar>

        <Line
          dataKey='ram_avg'
          name='ram'
          stroke={lineColor}
          strokeWidth={2}
          type='monotone'
          yAxisId='right'
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
)
