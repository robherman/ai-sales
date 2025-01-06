import { Customer } from "../../lib/types";

export function CustomerStatus({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-2">
      <div
        className={`badge ${customer.isPastCustomer ? "badge-primary" : "badge-ghost"}`}
      >
        Past Customer
      </div>
      <div
        className={`badge ${customer.isCurrentCustomer ? "badge-primary" : "badge-ghost"}`}
      >
        Current Customer
      </div>
      <div
        className={`badge ${customer.isFutureCustomer ? "badge-primary" : "badge-ghost"}`}
      >
        Future Customer
      </div>
      <div>
        <h3 className="font-semibold">Purchase Frequency</h3>
        <p>{customer.purchaseFrequency || "N/A"}</p>
      </div>
      <div>
        <h3 className="font-semibold">Status</h3>
        <p>{customer.status || "N/A"}</p>
      </div>
    </div>
  );
}
