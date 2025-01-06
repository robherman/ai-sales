"use client";

import { useState } from "react";
import { toast } from "sonner";
import ModelSelector from "../models/form-model-selector";

interface Props {
  config: any;
}

export default function ConversationSettings({ config }: Props) {
  const [settings, setSettings] = useState<any>({
    ...config,
    salesSteps: config.salesSteps || [],
    guardrails: {
      allowedLanguage: [],
      forbiddenTopics: [],
      ...config.guardrails,
    },
  });

  const updateNestedObject = (obj: any, path: string[], value: any): any => {
    const [current, ...rest] = path;
    if (rest.length === 0) {
      return { ...obj, [current]: value };
    }
    return {
      ...obj,
      [current]: updateNestedObject(obj[current] || {}, rest, value),
    };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setSettings((prev: any) => updateNestedObject(prev, keys, value));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // const response = await setChatbotConfig(DEFAULT_CHATBOT_ID, {
      //   config: settings,
      // });
      const response = null;
      if (response) {
        console.log(`saved`);
        toast.success("Configuración guardada exitosamente");
      } else {
        throw new Error("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Hubo un problema al guardar la configuración. Revisa los datos e intenta nuevamente.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="my-2">
        <h2 className="text-xl font-semibold">Conversación</h2>
        <div>
          <label className="label">Modelo</label>
          <ModelSelector
            value={settings.model}
            onChange={(m: string) =>
              handleChange({
                target: { name: "model", value: m },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </div>
        <div>
          <label className="label">Temperatura</label>
          <input
            type="number"
            name="temperature"
            value={settings.temperature}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="1"
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Tokens Máximos</label>
          <input
            type="number"
            name="maxTokens"
            value={settings.maxTokens}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar Configuración
      </button>
    </form>
  );
}
