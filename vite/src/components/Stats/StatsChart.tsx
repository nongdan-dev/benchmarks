import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import rust_stats from '../../assets/rust_stats.json';
import go_stats from '../../assets/go_stats.json';
import node_stats from '../../assets/node_stats.json';

const StatsChart = () => {


  // "cpu_min": 0.07,
  // "cpu_max": 593.2,
  // "cpu_avg": 509.22,
  // "ram_min": 223661260,
  // "ram_max": 240543334,
  // "ram_avg": 232564624,
  // "raw": [
  //   {
  //     "cpu": 558.63,
  //     "ram": 231945011,
  //     "ram_humanized": "221.2MB"
  //   },
  // ]
  const data = [
    {
      name: 'Node',
      cpu_min: node_stats.cpu_min,
      cpu_max: node_stats.cpu_max,
      cpu_avg: node_stats.cpu_avg,
      ram_min: node_stats.ram_min,
      ram_max: node_stats.ram_max,
      ram_avg: node_stats.ram_avg,
    },
    {
      name: 'Golang',
      cpu_min: go_stats.cpu_min,
      cpu_max: go_stats.cpu_max,
      cpu_avg: go_stats.cpu_avg,
      ram_min: go_stats.ram_min,
      ram_max: go_stats.ram_max,
      ram_avg: go_stats.ram_avg,
    },
    {
      name: 'Rust',
      cpu_min: rust_stats.cpu_min,
      cpu_max: rust_stats.cpu_max,
      cpu_avg: rust_stats.cpu_avg,
      ram_min: rust_stats.ram_min,
      ram_max: rust_stats.ram_max,
      ram_avg: rust_stats.ram_avg,
    },
  ];
  

  return (
    <div className="py-3 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Thống kê Docker trong Nodejs, Golang, Rust </h2>
      <ResponsiveContainer className={"py-1"} width="100%" height={400} >
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5, }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" 
            tick={{ fontWeight: "bold", fill: "#666", fontSize:18 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="cpu_min"
            fill="#8884d8"
            name="CPU Min(%)"
            fontSize={20}
            fontWeight={"bold"}
          />
          <Bar dataKey="cpu_max"
            fill="#82ca9d"
            name="CPU Max(%)"
          />
          <Bar
            dataKey="cpu_avg"
            fill="#8B4726"
            name="CPU Avg(%)"
            barSize={40}
          />
          <Bar
            dataKey="ram_min"
            fill="#FF8042"
            name="Ram Min(bytes)"
            barSize={40}
          />
          <Bar
            dataKey="ram_max"
            fill="#CC00FF"
            name="Ram Max(bytes)"
            barSize={40}
          />
          <Bar
            dataKey="ram_avg"
            fill="#82ca9d"
            name="Ram Avg(bytes)"
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
