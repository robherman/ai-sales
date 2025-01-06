"use client";

import { ModelSelector } from "../models/model-selector";

interface ChatControlsProps {
  reload: () => void;
  stop: () => void;
  clearChat: () => void;
  exportChat: () => void;
  isLoading: boolean;
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ChatControls({
  reload,
  stop,
  clearChat,
  exportChat,
  isLoading,
  models,
  selectedModel,
  onModelChange,
}: ChatControlsProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between space-x-2 space-y-2">
      <button
        onClick={reload}
        className="btn btn-outline btn-sm"
        disabled={isLoading}
      >
        Reload
      </button>
      <button
        onClick={stop}
        className="btn btn-outline btn-error btn-sm"
        disabled={!isLoading}
      >
        Stop
      </button>
      <button onClick={clearChat} className="btn btn-outline btn-sm">
        Clear Chat
      </button>
      <button onClick={exportChat} className="btn btn-outline btn-info btn-sm">
        Export Chat
      </button>
      <ModelSelector
        models={models}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
    </div>
  );
}
