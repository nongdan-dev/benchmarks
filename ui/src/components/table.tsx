import React from 'react'

import type { BData } from '@/assets/benchmark'
import { hNanosecond } from '@/utils/humanize'

interface TableViewProps {
  data: BData[]
}

export const Table: React.FC<TableViewProps> = ({ data }) => (
  <div className='overflow-x-auto'>
    <table className='max-w-full table-auto rounded-lg bg-white shadow-lg'>
      <thead>
        <tr className='border bg-gray-800 text-white'>
          <th className='border border-gray-800 px-4 py-2 text-left' />

          <th className='border border-gray-800 px-4 py-2 text-right'>p50</th>

          <th className='border border-gray-800 px-4 py-2 text-right'>p90</th>

          <th className='border border-gray-800 px-4 py-2 text-right'>p99</th>

          <th className='border border-gray-800 px-4 py-2 text-right'>tm99</th>

          <th className='border border-gray-800 px-4 py-2 text-right'>Max</th>

          <th className='border border-gray-800 px-4 py-2 text-right'>stdev</th>
        </tr>
      </thead>

      <tbody className=''>
        {data.map(row => (
          <tr
            className='hover:bg-gray-50'
            key={row.name}
          >
            <td className='border border-gray-800 px-4 py-2 font-medium text-gray-900'>
              {row.name}
            </td>

            <td className='border border-gray-800 px-4 py-2 text-right'>
              {hNanosecond(row.latency_p50)}
            </td>

            <td className='border border-gray-800 px-4 py-2 text-right'>
              {hNanosecond(row.latency_p90)}
            </td>

            <td className='border border-gray-800 px-4 py-2 text-right'>
              {hNanosecond(row.latency_p99)}
            </td>

            <td className='border border-gray-800 px-4 py-2 text-right'>
              {hNanosecond(row.latency_tm99)}
            </td>

            <td className='border border-gray-800 px-4 py-2 text-right'>
              {hNanosecond(row.latency_max)}
            </td>

            <td className='border border-gray-800 px-4 py-2 text-right'>
              {hNanosecond(row.latency_stdev)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
