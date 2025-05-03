import React from 'react'

import type { BData } from '@/assets/benchmark'
import { cx } from '@/utils/class-names'
import { hNanosecond } from '@/utils/humanize'

interface TableViewProps {
  data: BData[]
}

export const Table: React.FC<TableViewProps> = ({ data }) => {
  const rows = [
    'avg',
    'p50',
    'p90',
    'p99',
    'tm99',
    'max',
    'min',
    'stdev',
  ] as const
  const min = rows.reduce<{ [k: string]: number }>((m, r) => {
    m[r] = Math.min(...data.map(d => d[`latency_${r}`]))
    return m
  }, {})
  const min2 = rows.reduce<{ [k: string]: number }>((m, r) => {
    m[r] = Math.min(
      ...data.map(d => d[`latency_${r}`]).filter(v => v !== min[r]),
    )
    return m
  }, {})
  const max = rows.reduce<{ [k: string]: number }>((m, r) => {
    m[r] = Math.max(...data.map(d => d[`latency_${r}`]))
    return m
  }, {})
  return (
    <div className='overflow-x-auto'>
      <table className='max-w-full table-auto rounded-lg bg-white shadow-lg'>
        <thead>
          <tr className='border bg-gray-800 text-white'>
            <th className='border border-gray-800 px-4 py-2' />
            {rows.map(r => (
              <th
                key={r}
                className='border border-gray-800 px-4 py-2 text-right'
              >
                {r}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className=''>
          {data.map(d => (
            <tr
              key={d.framework}
              className='hover:bg-gray-50'
            >
              <td className='border border-gray-800 px-4 py-2 font-bold'>
                {d.framework}
              </td>
              {rows.map(r => {
                const v = d[`latency_${r}`]
                return (
                  <td
                    key={r}
                    className={cx(
                      'border border-gray-800 px-4 py-2 text-right',
                      {
                        'text-green-600': v === min[r],
                        'text-blue-600': v === min2[r],
                        'text-red-600': v === max[r],
                      },
                    )}
                  >
                    {hNanosecond(v)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
