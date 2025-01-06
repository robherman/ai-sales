import { notFound, redirect } from "next/navigation";
import { Session, Product } from "@/lib/types";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { getProductById } from "../../../../lib/apis/products";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const session = (await getSession()) as Session;

  if (!session?.user) {
    redirect(`/login?next=/products/${params.id}`);
  }

  const product: Product | null = await getProductById(
    session?.token,
    params.id,
  );
  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Details</h1>
        <Link href="/products" className="btn btn-secondary">
          Back to Products
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 text-2xl">{product.name}</h2>
            <p className="mb-4 text-lg">{product.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>SKU:</strong>
              </p>
              <p>{product.sku}</p>
              <p>
                <strong>Price:</strong>
              </p>
              <p>{formatCurrency(product.price)}</p>
              <p>
                <strong>Special Price:</strong>
              </p>
              <p>
                {product.specialPrice
                  ? formatCurrency(product.specialPrice)
                  : "N/A"}
              </p>
              <p>
                <strong>Retail Price:</strong>
              </p>
              <p>
                {product.retailPrice
                  ? formatCurrency(product.retailPrice)
                  : "N/A"}
              </p>
              <p>
                <strong>Stock:</strong>
              </p>
              <p>{product.stock || "Out of stock"}</p>
              <p>
                <strong>Category:</strong>
              </p>
              <p>{product.category}</p>
              <p>
                <strong>Subcategory:</strong>
              </p>
              <p>{product.subcategory}</p>
              <p>
                <strong>Brand:</strong>
              </p>
              <p>{product.brand}</p>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="mb-4 text-xl font-bold">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Manage Stock:</strong>
              </p>
              <p>{product.manageStock ? "Yes" : "No"}</p>
              <p>
                <strong>Is Offer:</strong>
              </p>
              <p>{product.isOffer ? "Yes" : "No"}</p>
              <p>
                <strong>Is Featured:</strong>
              </p>
              <p>{product.isFeatured ? "Yes" : "No"}</p>
              <p>
                <strong>Short Name:</strong>
              </p>
              <p>{product.shortName || "N/A"}</p>
              <p>
                <strong>Common Name:</strong>
              </p>
              <p>{product.commonName || "N/A"}</p>
              <p>
                <strong>Slug:</strong>
              </p>
              <p>{product.slug || "N/A"}</p>
              <p>
                <strong>External ID:</strong>
              </p>
              <p>{product.externalId || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold">Packaging Information</h3>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Unit Label:</strong>
              </p>
              <p>{product.unitLabel || "N/A"}</p>
              <p>
                <strong>Package Unit:</strong>
              </p>
              <p>{product.packageUnit || "N/A"}</p>
              <p>
                <strong>Package Label:</strong>
              </p>
              <p>{product.packageLabel || "N/A"}</p>
              <p>
                <strong>Package Unit Price:</strong>
              </p>
              <p>
                {product.packageUnitPrice
                  ? formatCurrency(product.packageUnitPrice)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold">Long Description</h3>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p>{product.longDescription || "No long description available."}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        {/* <Link href={`/products/${product.id}/edit`} className="btn btn-primary">
          Edit Product
        </Link> */}
      </div>
    </div>
  );
}
