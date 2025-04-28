import './App.css'

import PerformanceStatsChart from './components/Benchmark/PerformanceStatsChart'
import DockerStatsChart from './components/Stats/DockerStatsChart'

function App() {
 
  return (
    <div className='grid grid-cols-1' >
      <div className='w-full justify-between p-10'>
        <h1 className='font-bold py-10'>Docker Stats Chart</h1>
        {/* <StatsChart/> */}
        {/* <MixedChart/> */}
        <DockerStatsChart/>
        {/* <NodeStatsChart/>
        <RustStatsChart/> */}

        <h1 className='font-bold py-10'>Benchmarks Chart</h1>
        <PerformanceStatsChart/>

      </div>
    </div>
  )
}

export default App
