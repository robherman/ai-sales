"use client";

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <select
      className="select select-bordered select-sm"
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
    >
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}
