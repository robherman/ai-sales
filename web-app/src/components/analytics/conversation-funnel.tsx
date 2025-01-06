import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from "recharts";

export function ConversionFunnel({ data }: { data: any }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <FunnelChart>
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList
            position="right"
            fill="#000"
            stroke="none"
            dataKey="name"
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
