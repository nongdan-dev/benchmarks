import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import rust_stats from '../../assets/rust_stats.json';
import go_stats from '../../assets/go_stats.json';
import node_stats from '../../assets/node_stats.json';


export default function DockerStatsChart() {
  const data = [
    {
      name: 'Node',
      cpu_avg: node_stats.cpu_avg,
      ram_avg: node_stats.ram_avg,
    },
    {
      name: 'Golang',
      cpu_avg: go_stats.cpu_avg,
      ram_avg: go_stats.ram_avg,
    },
    {
      name: 'Rust',
      cpu_avg: rust_stats.cpu_avg,
      ram_avg: rust_stats.ram_avg,
    },
  ];
  const dataMB = data.map(item => ({
    ...item,
    ram_avg: +(item.ram_avg / (1024 * 1024)).toFixed(2),
  }));
  
  return (
    <div className="p-5 rounded shadow ">
      <h2 className="text-lg font-bold mb-4">Thống kê Docker Nodejs, Golang, Rust</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={dataMB}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{ value: 'CPU (%)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'RAM (MB)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            formatter={(value: any, name: any) => {
              if (name.includes('CPU')) return [`${value}%`, name];
              if (name.includes('RAM') || name.includes('Ram')) return [`${value}MB`, name];
              return [value, name];
            }}
          />
          <Legend />

          {/* Các cột RAM */}
          {/* <Bar yAxisId="left" dataKey="ram_avg" barSize={20} fill="#8B4726" name="RAM Avg (MB)" /> */}
          <Bar yAxisId="left" dataKey="cpu_avg" barSize={20} fill="#8884d8" name="CPU Avg (%)" />

          {/* Các đường CPU */}
          <Line yAxisId="right" type="monotone" dataKey="ram_avg" stroke="#00c0ff" name="RAM Avg (MB)" />
          {/* <Line yAxisId="right" type="monotone" dataKey="cpu_avg" stroke="#00c0ff" name="CPU Avg (%)" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
