"use client";

import {
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface ChatControlsProps {
  onClear: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onSearch: (query: string) => void;
}

export function ChatControls({
  onClear,
  onDelete,
  onArchive,
  onSearch,
}: ChatControlsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex flex-col space-y-2 bg-gray-200 p-4">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search chats..."
          className="flex-grow rounded-l-md border-b border-l border-t p-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-r-md bg-blue-500 p-2 text-white"
        >
          <MagnifyingGlassIcon />
        </button>
      </form>
      <div className="flex justify-between">
        <button onClick={onClear} className="btn btn-outline btn-sm">
          <XMarkIcon className="mr-2" /> Clear
        </button>
        <button onClick={onDelete} className="btn btn-outline btn-error btn-sm">
          <TrashIcon className="mr-2" /> Delete
        </button>
        <button
          onClick={onArchive}
          className="btn btn-outline btn-warning btn-sm"
        >
          <ArchiveBoxIcon className="mr-2" /> Archive
        </button>
      </div>
    </div>
  );
}
