"use client";

import React, { useState, useEffect } from "react";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

function SelectBox(props: any) {
  const {
    labelTitle,
    labelDescription,
    defaultValue,
    containerStyle,
    placeholder,
    labelStyle,
    options,
    updateType,
    updateFormValue,
  } = props;

  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue: any) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
    <div className={`inline-block ${containerStyle}`}>
      <label className={`label ${labelStyle}`}>
        <div className="label-text">
          {labelTitle}
          {labelDescription && (
            <div className="tooltip tooltip-right" data-tip={labelDescription}>
              <InformationCircleIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      </label>

      <select
        className="select select-bordered w-full"
        value={value}
        onChange={(e) => updateValue(e.target.value)}
      >
        <option disabled value="PLACEHOLDER">
          {placeholder}
        </option>
        {options.map((o: any, k: number) => {
          return (
            <option value={o.value || o.name} key={k}>
              {o.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default SelectBox;
