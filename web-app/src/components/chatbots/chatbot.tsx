"use client";

import { useState, useEffect } from "react";
import { Chatbot } from "@/lib/types";

interface Props {
  chatbotData: Chatbot;
}

export function ChatbotDetails({ chatbotData }: Props) {
  const [chatbot, setChatbot] = useState<Chatbot>(chatbotData);

  const updateConfig = async () => {
    // Implement API call to update chatbot configuration
    // const updatedConfig = await response.json();
    // setConfig(updatedConfig);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    // setLocalConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfig();
  };

  if (!chatbot) return <div>Loading configuration...</div>;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex justify-between">
        <h2 className="text-2xl font-bold">{chatbot.name}</h2>
      </div>
      <div className="flex-1">
        <div className="my-2">
          <h2 className="text-xl font-semibold">Agente</h2>

          <div>
            <label className="label">Nombre</label>
            <input
              name="name"
              value={chatbot?.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Identidad</label>
            <textarea
              name="identity"
              value={chatbot?.identityPromptTemplateId}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={5}
            />
          </div>
          <div>
            <label className="label">Instrucciones</label>
            <textarea
              name="instructions"
              value={chatbot?.instructionsPromptTemplateId}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={6}
            />
          </div>
        </div>
        <div className="my-2">
          <h2 className="text-xl font-semibold">Restricciones</h2>
          <div>
            <label className="label">Idiomas permitidos</label>
            <select
              multiple
              value={""}
              // onChange={handleLanguageChange}
              className="select select-bordered w-full"
              size={5}
            >
              {chatbot?.languages?.map((lang, i) => (
                <option key={i} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="model">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={chatbot.additionalConfig.model || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label" htmlFor="temperature">
            Temperature
          </label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={chatbot.additionalConfig.temperature || 0}
            onChange={handleChange}
            className="input input-bordered w-full"
            step="0.1"
            min="0"
            max="1"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
