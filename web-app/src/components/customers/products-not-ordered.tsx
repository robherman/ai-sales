import { getProductsNotOrdered } from "../../lib/apis/products";
import { ProductNoOrder } from "../../lib/types";

export async function ProductsNotOrdered({
  customerId,
}: {
  customerId: string;
}) {
  const productsNotOrdered = await getProductsNotOrdered(customerId);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Products Not Ordered</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Last Ordered</th>
              </tr>
            </thead>
            <tbody>
              {productsNotOrdered.map((product: ProductNoOrder) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{new Date(product.lastOrdered).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
