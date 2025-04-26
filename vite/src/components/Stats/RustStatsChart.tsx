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

const RustStatsChart = () => {
  const rawData = (rust_stats.raw || []).map((entry: Record<string, any>, index: number) => {
    const cleaned = Object.fromEntries(
      Object.entries(entry).filter(([key]) => !key.includes('_humanized'))
    );
    return { name: `Raw ${index + 1}`, ...cleaned };
  });

  const summaryData = [
    {
      name: 'Min',
      uv: rust_stats.cpu_min,
      av: rust_stats.ram_min,
    },
    {
      name: 'Max',
      uv: rust_stats.cpu_max,
      av: rust_stats.ram_max,
    },
    {
      name: 'Avg',
      uv: rust_stats.cpu_avg,
      av: rust_stats.ram_avg,
    },
  ];
  
  const data = [...rawData, ...summaryData];

  return (
    <div className="py-3 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Tổng quan CPU & RAM của Rust</h2>
      <ResponsiveContainer className={"py-1"} width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="cpu"
            fill="#8884d8"
            name="CPU (%)"
            // activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="ram"
            fill="#82ca9d"
            name="RAM (bytes)"
            // activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
          <Bar
            dataKey="uv"
            fill="#8B4726"
            name="Tổng CPU"
            barSize={40}
          />
          <Bar
            dataKey="av"
            fill="#FF8042"
            name="Tổng RAM"
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RustStatsChart;
