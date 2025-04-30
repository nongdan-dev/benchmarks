import '@/app.css'

import type { BSession } from '@/assets/benchmark'
import { benchmark } from '@/assets/benchmark'
import { Latency } from '@/components/latency'
import { Table } from '@/components/table'
import { Usage } from '@/components/usage'

export const Session = ({
  session: { data, concurrent, wrk2 },
}: {
  session: BSession
}) => (
  <>
    <h1 className='my-10 text-center text-4xl font-bold'>
      {wrk2 ? 'wrk2 rps' : 'wrk concurrent'} ={concurrent}
    </h1>

    <div className='flex flex-row justify-evenly'>
      <Latency data={data} />

      <Usage data={data} />
    </div>

    <div className='my-5 flex flex-row justify-evenly'>
      <Table data={data} />
    </div>
  </>
)

export const App = () => (
  <div className='m-10'>
    {benchmark.sessions.map(s => (
      <Session
        key={s.concurrent}
        session={s}
      />
    ))}
  </div>
)
