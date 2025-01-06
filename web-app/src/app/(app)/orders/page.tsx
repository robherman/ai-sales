import Link from "next/link";
import { getOrders } from "../../../lib/apis/orders";
import { getSession } from "../../../lib/auth";
import OrdersList from "../../../components/orders/orders-list";
import { redirect } from "next/navigation";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function OrdersPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session?.token) {
    redirect(`/login?next=/orders`);
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
    sort: sort || "orderDate",
    order: order || "desc",
    search,
    filter: JSON.stringify(filter),
  };
  const result = await getOrders(session?.token!, params);

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Link href="/orders/create" className="btn btn-primary">
          Crear Pedido
        </Link>
      </div>
      <OrdersList
        title="Órdenes"
        data={result?.orders || []}
        total={result?.total || 0}
        page={page}
        limit={limit}
        sortKey={sort}
        sortOrder={order}
        searchText={search}
      />
    </div>
  );
}
