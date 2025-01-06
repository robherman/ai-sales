"use client";

import { useState, useEffect } from "react";
import { SalesFlowStep } from "./sales-flow-step";
import { SalesFlowConnector } from "./sales-flow-connector";
import { SalesConfigSettings } from "../../lib/types";
import { DEFAULT_CHATBOT_ID } from "../../lib/constants";

export function SalesFlowBuilder() {
  const [config, setConfig] = useState<SalesConfigSettings>({});

  useEffect(() => {
    // Fetch chatbot config from API
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const data = {}; //await getChatbotConfig(DEFAULT_CHATBOT_ID);
    setConfig(data);
  };

  const updateSalesSteps = async (
    newSteps: Array<{ id: string; name: string; description: string }>,
  ) => {
    if (!config) return;

    const updatedConfig = { ...config, steps: newSteps };
    // Implement API call to update chatbot configuration
    setConfig(updatedConfig);
  };

  const addStep = () => {
    if (!config) return;
    const newStep = {
      id: Date.now().toString(),
      name: "New Step",
      description: "Description for the new step",
    };
    const newSteps = [...(config.steps || []), newStep];
    updateSalesSteps(newSteps);
  };

  const updateStep = (
    stepId: string,
    updatedStep: { name: string; description: string },
  ) => {
    if (!config) return;
    const newSteps = config.steps?.map((step) =>
      step.id === stepId ? { ...step, ...updatedStep } : step,
    );
    updateSalesSteps(newSteps || []);
  };

  const deleteStep = (stepId: string) => {
    if (!config) return;
    const newSteps = config.steps?.filter((step) => step.id !== stepId);
    updateSalesSteps(newSteps || []);
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sales Flow Steps</h2>
        <button className="btn btn-primary" onClick={addStep}>
          Add Step
        </button>
      </div>
      <div className="space-y-4">
        {config.steps?.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <SalesFlowStep
              step={step}
              onUpdate={(updatedStep) => updateStep(step.id, updatedStep)}
              onDelete={() => deleteStep(step.id)}
            />
            {config.steps?.length && index < config.steps.length - 1 && (
              <SalesFlowConnector />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
