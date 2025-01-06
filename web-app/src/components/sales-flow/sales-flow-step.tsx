"use client";
import { useState } from "react";
import { SalesStep } from "../../lib/types";

interface SalesFlowStepProps {
  step: SalesStep;
  onUpdate: (updatedStep: { name: string; description: string }) => void;
  onDelete: () => void;
}

export function SalesFlowStep({
  step,
  onUpdate,
  onDelete,
}: SalesFlowStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(step.name);
  const [description, setDescription] = useState(step.description);

  const handleSave = () => {
    onUpdate({ name, description });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card w-full bg-base-100 p-4 shadow-xl">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered mb-2 w-full"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered mb-2 w-full"
          rows={3}
        />
        <div className="flex justify-end space-x-2">
          <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full bg-base-100 p-4 shadow-xl">
      <h3 className="font-semibold">{step.name}</h3>
      <p className="text-sm">{step.description}</p>
      <div className="mt-2 flex justify-end space-x-2">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button className="btn btn-error btn-sm" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
