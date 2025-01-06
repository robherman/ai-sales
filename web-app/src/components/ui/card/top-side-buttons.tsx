"use client";

import { useEffect, useState } from "react";
import SearchBar from "../../search-bar";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";

export const TopSideButtons = ({
  removeFilter,
  applyFilter,
  applySearch,
}: any) => {
  const [filterParam, setFilterParam] = useState("");
  const [searchText, setSearchText] = useState("");

  const showFiltersAndApply = (params: any) => {
    applyFilter(params);
    setFilterParam(params);
  };

  const removeAppliedFilter = () => {
    removeFilter();
    setFilterParam("");
    setSearchText("");
  };

  useEffect(() => {
    if (searchText == "") {
      removeAppliedFilter();
    } else {
      applySearch(searchText);
    }
  }, [searchText]);

  return (
    <div className="float-right inline-block">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      {filterParam !== "" && (
        <button
          onClick={() => removeAppliedFilter()}
          className="btn btn-ghost btn-active btn-xs mr-2 normal-case"
        >
          {filterParam}
          <XMarkIcon className="ml-2 w-4" />
        </button>
      )}
      <div className="dropdown dropdown-end dropdown-bottom">
        <label tabIndex={0} className="btn btn-outline btn-sm">
          <FunnelIcon className="mr-2 w-5" />
          {`Filtro`}
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content w-52 rounded-box bg-base-100 p-2 text-sm shadow"
        >
          {/* {purchaseFrequencyFilter.map((l, k) => {
            return (
              <li key={k}>
                <a onClick={() => showFiltersAndApply(l)}>{l}</a>
              </li>
            );
          })} */}
          <div className="divider mb-0 mt-0"></div>
          <li>
            <a onClick={() => removeAppliedFilter()}>Quitar</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
