import React from "react";
import { hNanosecond, Stats } from "../assets";

type TableViewProps = {
  data: Stats[];
};

export const TableViewBenchmark: React.FC<TableViewProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="max-w-full table-auto bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-800 text-white border">
            <th className="px-4 py-2 text-left border"></th>
            <th className="px-4 py-2 text-right border">p50</th>
            <th className="px-4 py-2 text-right border">p90</th>
            <th className="px-4 py-2 text-right border">p99</th>
            {/* <th className="px-4 py-2 text-right">p99.9</th> */}
            <th className="px-4 py-2 text-right border">p99.99</th>
            <th className="px-4 py-2 text-right border">Min</th>
            <th className="px-4 py-2 text-right border">Max</th>
            <th className="px-4 py-2 text-right border">tm99.9</th>
            <th className="px-4 py-2 text-right border">stdev</th>
          </tr>
        </thead>
        <tbody className="">
          {data.map((row) => (
            <tr key={row.name} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-900 border">{row.name}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_p50)}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_p90)}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_p99)}</td>
              {/* <td className="px-4 py-2 text-right border">{row.p999}</td> */}
              <td className="px-4 py-2 text-right border ">{hNanosecond(row.latency_p9999)}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_min)}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_max)}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_tm999)}</td>
              <td className="px-4 py-2 text-right border">{hNanosecond(row.latency_stdev)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableViewBenchmark;
