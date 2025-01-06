import { notFound, redirect } from "next/navigation";
import { Order, OrderItem, Session } from "@/lib/types";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { getOrderById } from "../../../../lib/apis/orders";
import { formatDate, formatCurrency } from "@/lib/utils"; // Add these utility functions

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const session = (await getSession()) as Session;

  if (!session?.user) {
    redirect(`/login?next=/orders/${params.id}`);
  }

  const order: Order = await getOrderById(session?.token!, params.id);

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Information</h1>
        <Link href="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Order ID:</strong>
              </p>
              <p>{order.id}</p>
              <p>
                <strong>Order Number:</strong>
              </p>
              <p>{order.orderNumber}</p>
              <p>
                <strong>Customer:</strong>
              </p>
              <p>
                <Link
                  href={`/customers/${order.customerId}`}
                  className="link link-primary"
                >
                  {order.customerName}
                </Link>
              </p>
              <p>
                <strong>Date:</strong>
              </p>
              <p>{formatDate(order.orderDate)}</p>
              <p>
                <strong>Status:</strong>
              </p>
              <p>
                <span className={`badge ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Total:</strong>
              </p>
              <p>{formatCurrency(order.total)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Additional Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <p>
                <strong>Shipping Address:</strong> {order.shippingAddress}
              </p>
              <p>
                <strong>Billing Address:</strong> {order.billingAddress}
              </p>
              <p>
                <strong>External ID:</strong> {order.externalId || "N/A"}
              </p>
              <p>
                <strong>Discount:</strong>{" "}
                {order.discount ? formatCurrency(order.discount) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: OrderItem) => (
                <tr key={item.id}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-right font-bold">
                  Total:
                </td>
                <td>{formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string | undefined): string {
  switch (status?.toLowerCase()) {
    case "completed":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-info";
  }
}
