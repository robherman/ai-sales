"use client";

import { useState, useEffect } from "react";
import { PromptTemplate } from "../../lib/types";
import PromptForm from "./prompt-form";
import PromptDetails from "./prompt-details";
import { getPrompts } from "../../lib/apis/prompts";

const PromptList: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(
    null,
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(
    null,
  );

  const pageSize = 10;

  useEffect(() => {
    fetchPrompts();
  }, [currentPage, searchTerm]);

  const fetchPrompts = async () => {
    try {
      const response = await getPrompts();
      setPrompts(response);
      setTotalPages(response.length);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const handleSubmit = async (prompt: Partial<PromptTemplate>) => {
    try {
      if (editingPrompt) {
        // Update existing prompt
        // await api.updatePrompt(editingPrompt.id, prompt);
      } else {
        // Create new prompt
        // await api.createPrompt(prompt);
      }
      setIsFormVisible(false);
      setEditingPrompt(null);
      await fetchPrompts();
    } catch (error) {
      console.error("Error submitting prompt:", error);
    }
  };

  const handleEdit = (prompt: PromptTemplate) => {
    setEditingPrompt(prompt);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // await api.deletePrompt(id);
      await fetchPrompts();
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const handleViewDetails = (prompt: PromptTemplate) => {
    setSelectedPrompt(prompt);
  };

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Prompt Templates</h1>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsFormVisible(true)}
          className="btn btn-primary"
        >
          Create New Prompt
        </button>
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      {isFormVisible && (
        <div className="card mb-4 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
            </h2>
            <PromptForm
              prompt={editingPrompt || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormVisible(false);
                setEditingPrompt(null);
              }}
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Content</th>
              <th>Variables</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrompts.map((prompt) => (
              <tr key={prompt.id}>
                <td>{prompt.name}</td>
                <td>{prompt.content.substring(0, 50)}...</td>
                <td>{Object.keys(prompt.variables || {}).join(", ")}</td>
                <td>{prompt.isActive ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => handleViewDetails(prompt)}
                    className="btn btn-ghost btn-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(prompt)}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button className="btn">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
      {selectedPrompt && (
        <PromptDetails
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
};

export default PromptList;
