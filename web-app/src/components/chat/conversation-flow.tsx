import React from "react";

function ConversationFlow({ flow }: { flow: any }) {
  if (!flow) return <div>No conversation flow information available.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Conversation Flow</h3>
      <div className="space-y-2 text-sm">
        <InfoItem label="Current Step" value={flow.currentStep.name} />
        <InfoItem label="Next Step" value={flow.nextStep.name} />
        <div>
          <h4 className="mb-1 font-medium text-gray-600">All Steps:</h4>
          <ul className="list-inside list-decimal">
            {flow.steps.map((step: any, index: number) => (
              <li
                key={index}
                className={
                  step.name === flow.currentStep.name ? "font-bold" : ""
                }
              >
                {step.name}
              </li>
            ))}
          </ul>
        </div>
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

export default ConversationFlow;
