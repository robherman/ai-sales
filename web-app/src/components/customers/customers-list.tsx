"use client";

import { useState } from "react";
import { Customer } from "../../lib/types";
import { useRouter } from "next/navigation";
import GenericTable from "../ui/table/table";
import moment from "moment";
import { StatusBadge } from "./status-badge";
import { CustomerActions } from "./customer-list-actions";
import Link from "next/link";

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
    {
      header: "Nombre",
      accessor: "fullContactName",
      sortable: true,
      render: (r: any) => <div className="font-bold">{r.fullContactName}</div>,
    },
    { header: "Email", accessor: "email", sortable: false },
    { header: "Teléfono", accessor: "mobile", sortable: false },
    {
      header: "Dirección",
      accessor: "address.county",
      sortable: false,
      render: (r: any) => <div className="">{r.address?.county || "-"}</div>,
    },
    {
      header: "Estado",
      accessor: "status",
      sortable: false,
      render: (r: any) => <StatusBadge status={r.status} />,
    },
    {
      header: "Frecuencia Compra",
      accessor: "purchaseFrequency",
      sortable: false,
      render: (r: any) => (
        <div className="badge">
          {[r.purchaseFrequency, r.purchaseFrequencyDay]
            .filter((x) => x)
            .join("-")}
        </div>
      ),
    },
    {
      header: "Última Compra",
      accessor: "lastPurchaseAt",
      sortable: true,
      render: (r: any) => (
        <div className="">
          {r.lastOrderId && (
            <Link
              href={`/orders/${r.lastOrderId}`}
              title={`Pedido ${r.lastOrderId}`}
            >
              {moment(r.lastPurchaseAt).fromNow()}
            </Link>
          )}
        </div>
      ),
    },
    {
      header: "Cliente desde",
      accessor: "createdAt",
      sortable: true,
      render: (r: any) => (
        <div className="">
          {(r.createdAt && moment(r.createdAt).fromNow()) || "-"}
        </div>
      ),
    },
    {
      header: "Acciones",
      sortable: false,
      render: (row: any) => <CustomerActions customerId={row.id} />,
    },
  ];

  const removeFilter = () => {
    router.push("/customers");
  };

  const applyFilter = (params: any) => {
    router.push(`/customers?filter=${params}`);
  };

  const applySearch = (value: string) => {
    router.push(`/customers?search=${value}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/customers?page=${newPage}&limit=${limit}`);
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    router.push(
      `/customers?sort=${key}&order=${direction}&page=${page}&limit=${limit}`,
    );
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    router.push(`/customers?page=1&limit=${newLimit}`);
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
