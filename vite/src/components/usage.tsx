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
  Cell,
} from 'recharts'
import { hPercentage, hBytesYAxis, Stats } from '../assets'
import { colors, lineColor } from './colors'

export default function Usage({ data }: { data: Stats[] }) {
  return (
    <div className='w-[500px] rounded p-5 shadow'>
      <ResponsiveContainer
        width='100%'
        height={400}
      >
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid stroke='#f5f5f5' />
          <XAxis dataKey='name' />
          <YAxis
            yAxisId='left'
            orientation='left'
            width={80}
            tickFormatter={hPercentage}
          />
          <YAxis
            yAxisId='right'
            orientation='right'
            width={80}
            tickFormatter={hBytesYAxis}
          />
          <Tooltip
            formatter={(_, name, item) => {
              const { payload, dataKey } = item
              return [payload[`${dataKey}_humanized`], name]
            }}
          />
          <Legend />

          <Bar
            yAxisId='left'
            dataKey='cpu_avg'
            name='CPU'
            barSize={20}
          >
            {data.map((e, i) => (
              <Cell
                key={i}
                fill={colors[e.name]}
              />
            ))}
          </Bar>

          <Line
            yAxisId='right'
            type='monotone'
            dataKey='ram_avg'
            stroke={lineColor}
            name='RAM'
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
