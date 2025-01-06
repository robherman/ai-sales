"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Select = (
  <select className="select w-full max-w-xs">
    <option disabled selected>
      Pick your favorite Simpson
    </option>
    <option>Homer</option>
    <option>Marge</option>
    <option>Bart</option>
    <option>Lisa</option>
    <option>Maggie</option>
  </select>
);

export { Select };
