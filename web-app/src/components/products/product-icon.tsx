"use client";

import React from "react";

interface ProductIconProps {
  name: string;
  size?: number;
}

export function ProductIcon({ name, size = 100 }: ProductIconProps) {
  // Genera un color basado en el nombre del producto
  const color = `#${name
    .split("")
    .reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffff;
    }, 0)
    .toString(16)
    .padStart(6, "0")}`;

  // Obtén las iniciales del nombre del producto
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return <>{`Image`}</>;
}
