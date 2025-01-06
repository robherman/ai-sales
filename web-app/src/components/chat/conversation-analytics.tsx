import React from "react";

function ConversationAnalytics({
  analytics,
}: {
  analytics: {
    totalMessages: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokens: number;
    messageCount: number;
    averageInputTokens: number;
    averageOutputTokens: number;
    averageTotalTokens: number;
  };
}) {
  if (!analytics) return <div>No analytics information available.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Metricas de chat</h3>
      <div className="grid grid-cols-1 gap-2 text-sm">
        {/* <InfoItem label="Sentiment" value={analytics.sentiment} /> */}
        {/* <InfoItem label="Intent" value={analytics.intent} /> */}
        {/* <InfoItem label="Language" value={analytics.language} /> */}
        <InfoItem label="Mensajes" value={analytics.totalMessages} />
        <InfoItem label="Tokens" value={`${analytics.totalTokens}`} />
        <InfoItem label="Input" value={`${analytics.averageInputTokens}`} />
        <InfoItem label="Output" value={`${analytics.averageOutputTokens}`} />
        <InfoItem
          label="Total Promedio"
          value={`${analytics.averageTotalTokens}`}
        />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: any) {
  return (
    <div>
      <span className="font-semibold text-gray-600">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export default ConversationAnalytics;
