"use client";

import React, { useState, useEffect, useRef } from "react";

interface AutocompleteInputProps {
  input: string;
  handleInputChange: (value: string) => void;
  handleSubmit: () => void;
  suggestions: string[];
}

export function AutocompleteInput({
  input,
  handleInputChange,
  handleSubmit,
  suggestions,
}: AutocompleteInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    handleInputChange(userInput);
    setShowSuggestions(true);
    setActiveSuggestionIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions[activeSuggestionIndex]) {
        handleInputChange(filteredSuggestions[activeSuggestionIndex]);
        setShowSuggestions(false);
      } else {
        handleSubmit();
      }
    } else if (e.key === "ArrowUp") {
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (e.key === "ArrowDown") {
      if (activeSuggestionIndex < filteredSuggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        className="input input-bordered w-full"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={input}
        placeholder="Type your message..."
      />
      {showSuggestions && input && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 shadow-lg">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`cursor-pointer px-4 py-2 hover:bg-base-200 ${
                index === activeSuggestionIndex ? "bg-base-300" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
