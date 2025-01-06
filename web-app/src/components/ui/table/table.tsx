"use client";

import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import SearchBar from "../../search-bar";
import Pagination from "../../pagination";
import { TableTotals } from "./table-totals";

interface Props {
  title: string;
  columns: {
    id: string;
    header: string;
    accessor: string;
    sortable?: boolean;
    render: (r: any) => void;
  }[];
  data: any[];
  totalItems: number;
  itemsPerPage?: number;
  page?: number;
  searchText?: string;
  topSideButtons?: any;
  setSearchText: (ev: any) => void;
  onPageChange: (ev: any) => void;
  onFilterApply: (ev: any) => void;
  onFilterRemove: (ev: any) => void;
  onSort: (key: string, direction: "asc" | "desc") => void;
  sortConfig?: { key: string; direction: "asc" | "desc" };
  onItemsPerPageChange: (ev: any) => any;
}

const GenericTable = ({
  title,
  columns,
  data,
  topSideButtons,
  searchText,
  setSearchText,
  page = 1,
  totalItems,
  itemsPerPage = 50,
  onPageChange,
  onFilterApply,
  onFilterRemove,
  onSort,
  sortConfig,
  onItemsPerPageChange,
}: Props) => {
  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ChevronUpIcon className="ml-1 inline-block h-4 w-4" />
      ) : (
        <ChevronDownIcon className="ml-1 inline-block h-4 w-4" />
      );
    }
    return null;
  };
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  return (
    <div className={`card mt-6 w-full bg-base-100 p-6 shadow-xl`}>
      <div
        className={`text-xl font-semibold ${topSideButtons ? "inline-block" : ""}`}
      >
        {title}
        <div className="float-right inline-block">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeholderText={"Buscar"}
          />
        </div>
      </div>
      <TableTotals
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
      />
      <div className="divider mt-2"></div>
      <div className="h-full w-full bg-base-100 pb-6">
        <div className="w-full overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    onClick={() =>
                      column.sortable &&
                      onSort(
                        column.accessor,
                        sortConfig?.direction === "asc" ? "desc" : "asc",
                      )
                    }
                    className={column.sortable ? "cursor-pointer" : ""}
                  >
                    {column.header}
                    {column.sortable && getSortIcon(column.accessor)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={``}>
                      {column.render
                        ? column.render(row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TableTotals
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
        />
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default GenericTable;
