"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  config: any;
}

export default function SalesConfig({ config }: Props) {
  const [salesConfig, setConfig] = useState<any>({
    ...config,
  });
  const [newTopic, setNewTopic] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
    if (keys[0] === "steps") {
      const index = parseInt(keys[1]);
      const field = keys[2];
      setConfig((prev: any) => ({
        ...prev,
        steps: prev.steps.map((phase: any, i: any) =>
          i === index ? { ...phase, [field]: value } : phase,
        ),
      }));
    } else {
      setConfig((prev: any) => updateNestedObject(prev, keys, value));
    }
  };

  const handleChangeSteps = (e: any, index: number) => {
    const { name, value } = e.target;
    const updatedSteps = [...config.step];
    updatedSteps[index] = { ...updatedSteps[index], [name]: value };
    setConfig({ ...config, step: updatedSteps });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Hubo un problema al guardar la configuración. Revisa los datos e intenta nuevamente.",
      );
    }
  };

  const handleAddPhase = () => {
    setConfig((prev: any) => ({
      ...prev,
      steps: [...prev.steps, { id: uuidv4(), name: "", description: "" }],
    }));
  };

  const handleRemovePhase = (index: number) => {
    setConfig((prev: any) => ({
      ...prev,
      steps: prev.steps.filter((_: any, i: any) => i !== index),
    }));
  };

  const movePhase = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.steps.length) return;

    const items = Array.from(config.steps);
    const [movedItem] = items.splice(index, 1);
    items.splice(newIndex, 0, movedItem);

    setConfig((prev: any) => ({ ...prev, steps: items }));
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="my-2">
        <h2 className="text-xl font-semibold">Proceso de Venta</h2>
        <div>
          <label className="label">Descuento CrossSelling</label>
          <input
            name="crossSellingDiscount"
            type="number"
            value={config.crossSellingDiscount}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="100"
            className="input input-bordered w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="label">Fases de Conversación</label>
          <div className="space-y-2">
            {config.steps.map((phase: any, index: number) => (
              <div
                className="rounded-box border border-base-300 bg-base-100"
                key={`phase-${index}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex cursor-pointer items-center p-4 text-xl font-medium">
                  <span className="mr-2 cursor-move">☰</span>
                  {phase.name || `Fase ${index + 1}`}
                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePhase(index, "up");
                      }}
                      className="btn btn-ghost btn-xs"
                      disabled={index === 0}
                    >
                      <ArrowUpCircleIcon className="w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePhase(index, "down");
                      }}
                      className="btn btn-ghost btn-xs"
                      disabled={index === config.steps.length - 1}
                    >
                      <ArrowDownCircleIcon className="w-6" />
                    </button>
                  </div>
                </div>
                {expandedIndex === index && (
                  <div className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-2">
                      <label className="label">Nombre</label>
                      <input
                        name={`steps.${index}.name`}
                        value={phase.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="label">Descripción</label>
                      <textarea
                        name={`steps.${index}.description`}
                        value={phase.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        rows={3}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhase(index)}
                      className="btn btn-error btn-sm mt-2"
                    >
                      Eliminar Fase
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddPhase}
            className="btn btn-secondary btn-sm mt-2"
          >
            Agregar Nueva Fase
          </button>
        </div>
        <div>
          <label className="label">Mensaje Seguro</label>
          <input
            name="stepsFallbackMessage"
            type="text"
            defaultValue={`Si no puedes determinar el paso de la conversación simplemente responde "Lo siento, no entiendo tu pregunta. En que puedo ayudarte?".`}
            // onChange={handleChange}
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
