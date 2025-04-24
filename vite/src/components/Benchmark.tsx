import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

type StatsData = {
  Metric: string;
  Value: number;
};

type StatsProps = {
  benchmarkFile: string[];
};

const StatsChart = ({ benchmarkFile }: StatsProps) => {
  const [data, setData] = useState<StatsData[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");

  // Khi statsFile có dữ liệu và chưa có file nào được chọn thì chọn mặc định file đầu tiên
  useEffect(() => {
    if (benchmarkFile.length > 0 && !selectedFile) {
      setSelectedFile(benchmarkFile[0]);
    }
  }, [benchmarkFile, selectedFile]);

  // Fetch dữ liệu CSV từ file đã chọn
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
    <div className="w-7xl  p-4 ">
      <h2 className="mb-2 text-lg font-semibold">Docker Stats Chart</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Chọn file CSV:</label>
        <select
          className="border rounded p-1"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {benchmarkFile.map((file) => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Metric" tick={{ fontSize: 14, fontWeight:"bold"  }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Value" stroke="#8884d8" name="Metric Value" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-100">Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default StatsChart;
