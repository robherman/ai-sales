import React from "react";

function SalesAIInsights({
  insights,
}: {
  insights: Record<string, any> | null;
}) {
  if (!insights) return <div>No AI insights available.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AI Sales Insights</h3>
      <div className="space-y-2 text-sm">
        <InfoItem label="Customer Interest" value={insights.customerInterest} />
        <InfoItem label="Buying Stage" value={insights.buyingStage} />
        <InfoItem
          label="Recommended Action"
          value={insights.recommendedAction}
        />
        <div>
          <h4 className="mb-1 font-medium text-gray-600">Key Points:</h4>
          <ul className="list-inside list-disc">
            {insights.keyPoints.map((point: any, index: number) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
        <InfoItem label="Next Best Offer" value={insights.nextBestOffer} />
        <InfoItem
          label="Estimated Close Probability"
          value={`${insights.estimatedCloseProbability}%`}
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

export default SalesAIInsights;
