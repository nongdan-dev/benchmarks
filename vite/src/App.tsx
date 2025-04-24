import { useEffect, useState } from 'react'
import './App.css'
import StatsChart from './components/StatsChart'
import Benchmark from './components/Benchmark'

function App() {
  const [statsFile, setStatsFile] = useState<string[]>([])
  const [benchmarkFile, setBenchmarkFile] = useState<string[]>([])

  useEffect(() => {
    fetch('/list-csv')
      .then(res => res.json())
      .then((files: string[]) => {
        const csvFiles = files.filter(
          (f: string) => f.startsWith('capture_usage_') && f.endsWith('.csv'),
        )
        const benchmark = files.filter(
          (f: string) => !f.startsWith('capture_usage_') || !f.endsWith('.csv'),
        )

        setStatsFile(csvFiles)
        setBenchmarkFile(benchmark)
      })
  }, [])

  return (
    <div className='my-36 w-full'>
      <h1>Docker Stats Chart</h1>
      <StatsChart statsFile={statsFile} />

      <h1>Benchmark Chart</h1>
      <Benchmark benchmarkFile={benchmarkFile} />
    </div>
  )
}

export default App

// repo/
// ├─go/
// ├─node/
// ├─rust/
// ├─vite/
// ├─ node_modules/
// ├─ public/
// ├─ src/
// │  ├─ App.tsx
// │  ├─ main.tsx
// │  ├─ components
// │  │  ├─ components/
// │  │  │  ├─ StatsChart.tsx
// ├─ index.html
// ├─ tsconfig.json
// ├─ vite.config.ts
// ├─ package.json
// ├─wrk/
// │  ├─ output/ trong đây là file cvs
// ├─ docker-compose.yml
// ├─ Makefile
// ├─ .env
