"use client";

import Image from "next/image";
import { Product } from "../../lib/types";
import { ProductIcon } from "../products/product-icon";
import React from "react";

export function ProductListToolResult({
  result,
  args,
}: {
  result?: Product[];
  args?: any;
}) {
  const [products, setProducts] = React.useState<Product[]>([]);

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="card bg-base-100 shadow-xl">
          <figure className="px-4 pt-4">
            <ProductIcon name={product.name} size={200} />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-lg">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xl font-bold">
                ${formatPrice(product.price)}
              </span>
              {product.isOffer && (
                <span className="badge badge-accent">Oferta</span>
              )}
            </div>
            <div className="card-actions mt-4 justify-end">
              <button className="btn btn-primary btn-sm">Ver detalles</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductListToolCall({
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
