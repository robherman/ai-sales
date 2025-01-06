"use client";

import React, { useState, useEffect } from "react";
import { PromptTemplate } from "../../lib/types";

interface PromptFormProps {
  prompt?: PromptTemplate;
  onSubmit: (prompt: Partial<PromptTemplate>) => void;
  onCancel: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<PromptTemplate>>({
    name: "",
    content: "",
    variables: {},
    isActive: true,
  });
  const [newVariable, setNewVariable] = useState({ key: "", value: "" });

  useEffect(() => {
    if (prompt) {
      setFormData(prompt);
    }
  }, [prompt]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariableAdd = () => {
    if (newVariable.key && newVariable.value) {
      setFormData((prev) => ({
        ...prev,
        variables: { ...prev.variables, [newVariable.key]: newVariable.value },
      }));
      setNewVariable({ key: "", value: "" });
    }
  };

  const handleVariableRemove = (key: string) => {
    const updatedVariables = { ...formData.variables };
    delete updatedVariables[key];
    setFormData((prev) => ({ ...prev, variables: updatedVariables }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="textarea textarea-bordered h-24"
          required
        />
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Active</span>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
            }
            className="checkbox"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Variables</span>
        </label>
        <div className="mb-2 flex space-x-2">
          <input
            type="text"
            placeholder="Key"
            value={newVariable.key}
            onChange={(e) =>
              setNewVariable({ ...newVariable, key: e.target.value })
            }
            className="input input-bordered flex-1"
          />
          <input
            type="text"
            placeholder="Value"
            value={newVariable.value}
            onChange={(e) =>
              setNewVariable({ ...newVariable, value: e.target.value })
            }
            className="input input-bordered flex-1"
          />
          <button
            type="button"
            onClick={handleVariableAdd}
            className="btn btn-secondary"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(formData.variables || {}).map(([key, value]: any) => (
            <div
              key={key}
              className="flex items-center justify-between rounded bg-base-200 p-2"
            >
              <span>
                {key}: {value}
              </span>
              <button
                type="button"
                onClick={() => handleVariableRemove(key)}
                className="btn btn-ghost btn-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {prompt ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
export default PromptForm;
