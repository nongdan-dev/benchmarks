import './App.css'
import RustBenchmark from './components/Benchmark/Benchmark'
// import GoStatsChart from './components/Stats/GoStatsChart'
// import NodeStatsChart from './components/Stats/NodeStatsChart'
// import RustStatsChart from './components/Stats/RustStatsChart'
import StatsChart from './components/Stats/StatsChart'

function App() {
 
  return (
    <div className='grid grid-cols-1' >
      <div className='w-full justify-between'>
        <h1 className='font-bold py-10'>Docker Stats Chart</h1>
        <StatsChart/>
        {/* <GoStatsChart/>
        <NodeStatsChart/>
        <RustStatsChart/> */}

        <h1 className='font-bold py-10'>Benchmarks Chart</h1>
        <RustBenchmark/>

      </div>
    </div>
  )
}

export default App
