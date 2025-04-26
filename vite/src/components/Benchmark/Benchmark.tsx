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
import rust_wrk from '../../assets/rust_wrk.json';
import go_wrk from '../../assets/go_wrk.json';
import node_wrk from '../../assets/node_wrk.json';

const Benchmark = () => {

  const data = [
    {
      name: 'wrk Node',
      duration: node_wrk.duration,
      total_requests: node_wrk.total_requests,
      requests_per_second: node_wrk.requests_per_second,
      transfer_per_second: node_wrk.transfer_per_second,
      latency_p50: node_wrk.latency_p50,
      latency_p90: node_wrk.latency_p90,
      latency_p99: node_wrk.latency_p99,
      latency_p9999: node_wrk.latency_p9999,
      latency_min: node_wrk.latency_min,
      latency_max: node_wrk.latency_max,
      latency_avg: node_wrk.latency_avg,
    },
    {
      name: 'wrk Golang',
      duration: go_wrk.duration,
      total_requests: go_wrk.total_requests,
      requests_per_second: go_wrk.requests_per_second,
      transfer_per_second: go_wrk.transfer_per_second,
      latency_p50: go_wrk.latency_p50,
      latency_p90: go_wrk.latency_p90,
      latency_p99: go_wrk.latency_p99,
      latency_p9999: go_wrk.latency_p9999,
      latency_min: go_wrk.latency_min,
      latency_max: go_wrk.latency_max,
      latency_avg: go_wrk.latency_avg,
    },
    {
      name: 'wrk Rust',
      duration: rust_wrk.duration,
      total_requests: rust_wrk.total_requests,
      requests_per_second: rust_wrk.requests_per_second,
      transfer_per_second: rust_wrk.transfer_per_second,
      latency_p50: rust_wrk.latency_p50,
      latency_p90: rust_wrk.latency_p90,
      latency_p99: rust_wrk.latency_p99,
      latency_p9999: rust_wrk.latency_p9999,
      latency_min: rust_wrk.latency_min,
      latency_max: rust_wrk.latency_max,
      latency_avg: rust_wrk.latency_avg,
    },
    
  ];
  

  return (
    <div className="py-3 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Hiểu xuất Requests trong Nodejs, Golang, Rust</h2>
      <ResponsiveContainer className={"py-1"} width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"
            tick={{ fontWeight: "bold", fill: "#666", fontSize: 18 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="duration"
            fill="#8884d8"
            name="Duration"
          />
          <Bar dataKey="total_requests"
            fill="#82ca9d"
            name="Total Requests"
          />
          <Bar
            dataKey="requests_per_second"
            fill="#8B4726"
            name="Requests Per Second"
            barSize={40}
          />
          <Bar
            dataKey="transfer_per_second"
            fill="#FF8042"
            name="Transfer Per Second"
            barSize={40}
          />
          <Bar
            dataKey="latency_p50"
            fill="#CC00FF"
            name="Latency p50"
            barSize={40}
          />
          <Bar
            dataKey="latency_p90"
            fill="#82ca9d"
            name="Latency p90"
            barSize={40}
          />
          <Bar
            dataKey="latency_p99"
            fill="#99FF33"
            name="Latency p99"
            barSize={40}
          />
          <Bar
            dataKey="latency_p9999"
            fill="#CCCC00"
            name="Latency p9999"
            barSize={40}
          />
          <Bar
            dataKey="latency_min"
            fill="#CC9933"
            name="Latency Min"
            barSize={40}
          />
          <Bar
            dataKey="latency_max"
            fill="#6699CC"
            name="Latency Max"
            barSize={40}
          />
          <Bar
            dataKey="latency_avg"
            fill="#CC0066"
            name="Latency avg"
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Benchmark;
