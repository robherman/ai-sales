import { getRecommendedProducts } from "../../lib/apis/products";
import { Product } from "../../lib/types";

export async function RecommendedProducts({
  customerId,
}: {
  customerId: string;
}) {
  const recommendedProducts = await getRecommendedProducts(customerId);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Recommended Products</h2>
        <div className="space-y-2">
          {recommendedProducts?.map((product: Product) => (
            <div key={product.id} className="flex items-center space-x-2">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm">
                  ${(Number(product.price) || 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
