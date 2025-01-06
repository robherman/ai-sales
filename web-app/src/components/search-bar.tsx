import React from "react";
import { useDebouncedCallback } from "use-debounce";

function SearchBar({
  searchText,
  styleClass,
  placeholderText,
  setSearchText,
}: any) {
  const handleSearch = useDebouncedCallback((term) => {
    setSearchText(term);
  }, 300);

  const updateSearchInput = (value: any) => {
    setSearchText(value);
  };

  return (
    <div className={"inline-block " + styleClass}>
      <div className="input-group relative flex w-full flex-wrap items-stretch">
        <input
          type="search"
          value={searchText}
          placeholder={placeholderText || "Search"}
          onChange={(e) => handleSearch(e.target.value)}
          className="input input-sm input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
}

export default SearchBar;
