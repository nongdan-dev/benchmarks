import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

type StatsData = {
  timestamp: string;
  cpu_percent: number;
  mem_usage_mb: number;
  mem_percent: number;
};

type StatsProps = {
  statsFile: string[]
}

const StatsChart = ({statsFile}: StatsProps) => {
  const [data, setData] = useState<StatsData[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");

  useEffect(() => {
    if (statsFile.length > 0 && !selectedFile) {
      setSelectedFile(statsFile[0]);
    }
  }, [statsFile, selectedFile]);



  useEffect(() => {
    if (!selectedFile) return;

    fetch(`/data/${selectedFile}`)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse<StatsData>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => setData(results.data),
        });
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  }, [selectedFile]);

  return (
    <div className="w-7xl p-4">
      <div className="mb-4">
        <label className="mr-2 font-medium">Chọn file CSV:</label>
        <select
          className="border rounded p-1"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {statsFile.map((file) => (
            <option key={file}  value={file}>{file}</option>
          ))}
        </select>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 14, fontWeight:"bold"  }} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="cpu_percent" stroke="#8884d8" name="CPU (%)" />
            <Line yAxisId="left" type="monotone" dataKey="mem_percent" stroke="#82ca9d" name="Mem (%)" />
            <Line yAxisId="right" type="monotone" dataKey="mem_usage_mb" stroke="#ffc658" name="Mem Usage (MB)" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default StatsChart;
