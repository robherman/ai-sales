import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export function SentimentChart({ data }: { data: SentimentData }) {
  const COLORS = ["#36A2EB", "#FFCE56", "#FF6384"];
  const chartData = [
    { name: "Positive", value: data.positive },
    { name: "Neutral", value: data.neutral },
    { name: "Negative", value: data.negative },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry: any, index: any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
