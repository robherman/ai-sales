"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  company: any;
}

export default function CompanySettings({}: Props) {
  const [company, setCompany] = useState<any>({});

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
    setCompany((prev: any) => updateNestedObject(prev, keys, value));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Empresa/Negocio</h2>
        <div>
          <label className="label">Nombre</label>
          <input
            name="name"
            value={company.name}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Sitio web</label>
          <input
            name="website"
            value={company.website}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea
            name="description"
            value={company.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={5}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar Configuración
      </button>
    </form>
  );
}
