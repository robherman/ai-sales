import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ResponseTimeAnalysis({ data }: { data: any }) {
  return (
    <div>
      <p className="mb-4 text-lg font-semibold">
        Average Response Time: {data.averageResponseTime}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.responseTimeDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
