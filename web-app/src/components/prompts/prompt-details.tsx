"use client";

import React from "react";
import { PromptTemplate } from "../../lib/types";

interface PromptDetailsProps {
  prompt: PromptTemplate;
  onClose: () => void;
}

const PromptDetails: React.FC<PromptDetailsProps> = ({ prompt, onClose }) => {
  return (
    <div
      className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {prompt.name}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">Content: {prompt.content}</p>
            <p className="mt-2 text-sm text-gray-500">
              Variables:{" "}
              {Object.entries(prompt.variables || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Active: {prompt.isActive ? "Yes" : "No"}
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetails;
