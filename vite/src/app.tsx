import './app.css'
import { Stats, stats1000, stats10000, stats100 } from './assets'

import Latency from './components/latency'
import Usage from './components/usage'

const Composed = ({ data, concurrent }: { data: Stats[]; concurrent: number }) => {
  return (
    <>
      <h1 className='py-10 font-bold'>concurrent={concurrent}</h1>
      <div className='flex flex-row justify-evenly'>
        <Latency data={data} />
        <Usage data={data} />
      </div>
    </>
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
    </div>
  )
}

export default App
