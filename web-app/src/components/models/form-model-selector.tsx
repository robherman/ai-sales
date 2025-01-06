"use client";

import { useState, useEffect } from "react";
import { DEFAULT_MODELS } from "../../lib/constants";
import { AIModel } from "../../lib/types";

export default function ModelSelector({ value, onChange }: any) {
  const [models, setModels] = useState<AIModel[]>(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState<string>(value || "");

  useEffect(() => {
    const fetchModels = async () => {
      // setModels(models);
      // setSelectedModel(models[0]?.id || "");
    };

    fetchModels();
  }, []);

  const handleModelChange = async (modelId: string) => {
    setSelectedModel(modelId);
    onChange(modelId);
  };

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">Seleccionar modelo</span>
      </label>
      <select
        className="select select-bordered"
        value={selectedModel}
        onChange={(e) => handleModelChange(e.target.value)}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <label className="label">
        <span className="label-text-alt">
          {models.find((m) => m.id === selectedModel)?.description}
        </span>
      </label>
    </div>
  );
}
