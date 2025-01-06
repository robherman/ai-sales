import React from "react";
import moment from "moment";
import { Order } from "../../lib/types";

function LastOrder({ order }: { order?: Order | null }) {
  if (!order) return <div>No last order information available.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Last Order</h3>
      <div className="space-y-2 text-sm">
        <InfoItem label="Order ID" value={order.id} />
        <InfoItem
          label="Date"
          value={moment(order.orderDate).format("MMMM D, YYYY")}
        />
        <InfoItem
          label="Total"
          value={`$${Number(order.total || 0).toFixed(2)}`}
        />
        <InfoItem label="Status" value={order.status} />
        <div>
          <h4 className="mb-1 font-medium text-gray-600">Items:</h4>
          <ul className="list-inside list-disc">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} (x{item.quantity})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: any) {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export default LastOrder;
