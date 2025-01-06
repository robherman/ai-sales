import { getCustomers } from "@/lib/apis/customers";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import CustomerList from "@/components/customers/customers-list";
import { redirect } from "next/navigation";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function CustomersPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session?.token) {
    redirect(`/login?next=/customers`);
  }
  const page = Number(searchParams?.page || 1);
  const limit = Number(searchParams?.limit || 100);
  const sort = searchParams?.sort as string | undefined;
  const order = searchParams?.order as "asc" | "desc" | undefined;
  const search = searchParams?.search as string | undefined;
  const filter = searchParams?.filter as string | undefined;
  const params = {
    page,
    limit,
    sort: sort || "lastPurchaseAt",
    order: order || "desc",
    search,
    filter: JSON.stringify(filter),
  };
  const data = await getCustomers(session?.token!, params);

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Link href="/customers/create" className="btn btn-primary">
          Nuevo Cliente
        </Link>
      </div>
      <CustomerList
        title="Clientes"
        data={data.customers}
        total={data.total}
        page={page}
        limit={limit}
        sortKey={sort}
        sortOrder={order}
        searchText={search}
      />
    </div>
  );
}
