import { Customer } from "../../lib/types";
import { CustomerActions } from "./customer-actions";

export function CustomerHeader({ customer }: { customer: Customer }) {
  return (
    <div className="sticky top-0 z-10 mb-4 bg-base-100 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <div className="flex items-center space-x-4">
          <CustomerActions customerId={customer.id} />
          <span className="badge badge-primary">{customer.status}</span>
          <span>Balance: ${customer.balance.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
