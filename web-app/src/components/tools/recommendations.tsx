"use client";

import Image from "next/image";
import { Product } from "../../lib/types";
import { ProductIcon } from "../products/product-icon";

export function RecommendationsToolResult({
  result,
  type,
  args,
}: {
  result?: Product[];
  type?: "create" | "update";
  args?: any;
}) {
  const recommendations = result || [];

  const formatPrice = (price: any) => {
    if (typeof price === "number") {
      return price.toFixed(2);
    } else if (typeof price === "string") {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
    }
    return "0.00";
  };

  return (
    <div className="rounded-lg bg-base-200 p-4">
      <h3 className="mb-4 text-xl font-semibold">Recomendaciones</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recommendations.map((product) => (
          <div key={product.id} className="card bg-base-100 shadow-sm">
            <figure className="px-4 pt-4">
              <ProductIcon name={product.name} size={200} />
            </figure>
            <div className="card-body p-4">
              <h4 className="card-title text-sm">{product.name}</h4>
              <p className="line-clamp-2 text-xs text-gray-600">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold">
                  ${formatPrice(product.price)}
                </span>
                <button className="btn btn-outline btn-primary btn-xs">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationsToolCall({
  type,
  args,
}: {
  type?: "create" | "update";
  args?: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="animate-pulse">
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
