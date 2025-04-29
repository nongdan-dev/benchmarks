import './app.css'
import { Stats, stats1000, stats10000, stats100 } from './assets'

import Latency from './components/latency'
import TableView from './components/table-view-wrk'
import Usage from './components/usage'

const Composed = ({ data, concurrent }: { data: Stats[]; concurrent: number }) => {
  return (
    <>
      <h1 className='py-10 font-bold'>concurrent={concurrent}</h1>
      <div className='flex flex-row justify-evenly'>
        <Latency data={data} />
        <Usage data={data} />

      </div>
      <div className='flex mt-5 flex-row justify-evenly'>
        <TableView data={data}/>
      </div>
    </>
  )
}

const ComposedTable = ({ data, concurrent }: { data: Stats[]; concurrent: number }) => {
  return (
    <div className='flex flex-col '>
      <h1 className='py-5 font-bold'>concurrent={concurrent}</h1>
        <TableView data={data}/>
    </div>
  )
}

function App() {
  return (
    <div className='p-10'>
      <Composed
        concurrent={100}
        data={stats100}
      />
      <Composed
        concurrent={1000}
        data={stats1000}
      />
      <Composed
        concurrent={10000}
        data={stats10000}
      />

      {/* View Table */}
      {/* <div className='flex flex-wrap'>
        <ComposedTable
          concurrent={100}
          data={stats100} />
        <ComposedTable
          concurrent={1000}
          data={stats1000} />
        <ComposedTable
          concurrent={10000}
          data={stats10000} />
      </div> */}

    </div>
  )
}

export default App
