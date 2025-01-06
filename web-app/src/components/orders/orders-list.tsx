"use client";

import ViewIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import TitleCard from "../ui/card/title-card";
import { useState } from "react";
import Link from "next/link";
import moment from "moment";
import { Order } from "../../lib/types";
import { useRouter } from "next/navigation";
import GenericTable from "../ui/table/table";

interface ListProps {
  title: string;
  data: Order[];
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
    { header: "# Orden", accessor: "orderNumber", sortable: true },
    {
      header: "Cliente",
      accessor: "customerId",
      sortable: false,
      render: (r: any) => (
        <Link
          href={`/customers/${r.customerId}`}
          className="link link-primary"
          target="_blank"
        >
          {r.customerId}
        </Link>
      ),
    },
    {
      header: "Fecha",
      accessor: "orderDate",
      sortable: true,
      render: (r: any) => (
        <div className="">{moment(r.orderDate).format("DD-MM-YYYY hh:mm")}</div>
      ),
    },
    {
      header: "Items",
      accessor: "itemsCount",
      sortable: false,
      render: (r: any) => (
        <div className="">{r.items ? `${r.items.length}` : "0"}</div>
      ),
    },
    {
      header: "Total",
      accessor: "total",
      sortable: true,
      render: (r: any) => (
        <div className="">
          {r.total ? `$${Number(r.total.toString()).toFixed(2)}` : "-"}
        </div>
      ),
    },
    {
      header: "Estado",
      accessor: "status",
      sortable: false,
      render: (r: any) => <div className="badge">{r.status}</div>,
    },
    {
      header: "Acciones",
      sortable: false,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <Link
            href={`/orders/${row.id}`}
            className="btn btn-square btn-sm mr-2"
          >
            <ViewIcon className="w-5" />
          </Link>
        </div>
      ),
    },
  ];

  const removeFilter = () => {
    router.push("/orders");
  };

  const applyFilter = (params: any) => {
    router.push(`/orders?filter=${params}`);
  };

  const applySearch = (value: string) => {
    router.push(`/orders?search=${value}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/orders?page=${newPage}&limit=${limit}`);
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    router.push(
      `/orders?sort=${key}&order=${direction}&page=${page}&limit=${limit}`,
    );
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    router.push(`/orders?page=1&limit=${newLimit}`);
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
          key: sortKey || "orderDate",
          direction: sortOrder || "desc",
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </>
  );
}

export default List;
