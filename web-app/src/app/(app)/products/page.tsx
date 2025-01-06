import Link from "next/link";
import { getProducts } from "../../../lib/apis/products";
import { getSession } from "../../../lib/auth";
import ProductsList from "@/components/products/products-list";
import { redirect } from "next/navigation";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Products({ searchParams }: Props) {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?next=/products`);
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
    sort: sort || "createdAt",
    order: order || "desc",
    search,
    filter: JSON.stringify(filter),
  };
  const data = await getProducts(session?.token!, params);

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Link href="/products/create" className="btn btn-primary">
          Nuevo Producto
        </Link>
      </div>
      <ProductsList
        title="Productos"
        data={data?.products || []}
        total={data?.total || 0}
        page={page}
        limit={limit}
        sortKey={sort}
        sortOrder={order}
        searchText={search}
      />
    </div>
  );
}
