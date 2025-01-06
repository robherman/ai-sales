"use client";

import ViewIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import { useState } from "react";
import Link from "next/link";
import ChatBubbleLeftEllipsisIcon from "@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon";
import { Customer } from "../../lib/types";
import { useRouter } from "next/navigation";
import GenericTable from "../ui/table/table";
import moment from "moment";
import { CheckIcon, StarIcon } from "@heroicons/react/24/outline";

interface ListProps {
  title: string;
  data: Customer[];
  total: number;
  limit?: number;
  page?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  searchText?: string;
}

function List({
  title,
  data,
  total,
  limit = 50,
  page = 1,
  sortKey,
  sortOrder,
  searchText,
}: ListProps) {
  const [items, setItems] = useState(data);
  const router = useRouter();

  const columns: any[] = [
    { header: "SKU", accessor: "sku", sortable: true },
    { header: "Nombre", accessor: "name", sortable: true },
    {
      header: "Categoría",
      accessor: "category",
      sortable: false,
      render: (r: any) => (
        <div>
          <span className="badge">{r.category}</span>
        </div>
      ),
    },
    {
      header: "Precio $",
      accessor: "price",
      sortable: true,
      render: (r: any) => (
        <div className="">
          {r.price
            ? `$${Number(r.price.toString()).toFixed(2)} (${r.unitLabel})`
            : "-"}
        </div>
      ),
    },
    {
      header: "Precio $ Paq.",
      accessor: "packageUnitPrice",
      sortable: true,
      render: (r: any) => (
        <div className="">
          {r.packageUnitPrice
            ? `$${Number(r.packageUnitPrice.toString()).toFixed(2)} x ${r.packageLabel} (${r.packageUnit})`
            : "-"}
        </div>
      ),
    },
    {
      header: "Destacado",
      accessor: "isFeatured",
      sortable: true,
      render: (r: any) => (
        <div className="">{r.isFeatured && <StarIcon className="w-6" />}</div>
      ),
    },
    {
      header: "Oferta",
      accessor: "isOffer",
      sortable: false,
      render: (r: any) => (
        <div className="">{r.isOffer && <CheckIcon className="w-6" />}</div>
      ),
    },
    {
      header: "Acciones",
      sortable: false,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <Link
            href={`/products/${row.id}`}
            className="btn btn-square btn-sm mr-2"
          >
            <ViewIcon className="w-5" />
          </Link>
        </div>
      ),
    },
  ];

  const removeFilter = () => {
    router.push("/products");
  };

  const applyFilter = (params: any) => {
    router.push(`/products?filter=${params}`);
  };

  const applySearch = (value: string) => {
    router.push(`/products?search=${value}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/products?page=${newPage}&limit=${limit}`);
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    router.push(
      `/products?sort=${key}&order=${direction}&page=${page}&limit=${limit}`,
    );
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    router.push(`/products?page=1&limit=${newLimit}`);
  };

  return (
    <>
      <GenericTable
        title={title}
        columns={columns}
        data={data}
        searchText={searchText}
        setSearchText={applySearch}
        page={page}
        totalItems={total}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onFilterApply={applyFilter}
        onFilterRemove={removeFilter}
        onSort={handleSort}
        sortConfig={{
          key: sortKey || "createdAt",
          direction: sortOrder || "desc",
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </>
  );
}

export default List;
