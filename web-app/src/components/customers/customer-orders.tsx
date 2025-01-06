import Link from "next/link";
import { getOrdersByCustomer } from "../../lib/apis/orders";
import { getSession } from "../../lib/auth";
import { Order, Session } from "../../lib/types";

export async function CustomerOrders({ customerId }: { customerId: string }) {
  const session = (await getSession()) as Session;
  const orders = await getOrdersByCustomer(session.token!, customerId);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/orders/${order.id}`}>
                      {order.orderNumber || order.id}
                    </Link>
                  </td>
                  <td>{new Date(order.orderDate || "").toDateString()}</td>
                  <td>${Number(order.total || 0).toFixed(2)}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
