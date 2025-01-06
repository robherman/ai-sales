import { Suspense } from "react";
import { CustomerInfo } from "./customer-info";
import { CustomerOrders } from "./customer-orders";
import { CustomerChats } from "./customer-chats";
import { Customer } from "../../lib/types";
import { CustomerStatus } from "./customer-status";
import { ProductsNotOrdered } from "./products-not-ordered";
import { RecommendedProducts } from "./recommended-products";
import LoadingSpinner from "../loading-spinner";
import { CustomerHeader } from "./customer-header";
import { Tabs } from "../ui/tabs";
import { CustomerTimeline } from "./customer-timeline";

export function CustomerDetail({ customer }: { customer: Customer }) {
  if (!customer) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <CustomerHeader customer={customer} />
      <Tabs
        tabs={[
          {
            label: "Overview",
            content: (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Customer Information</h2>
                      <CustomerInfo customer={customer} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Customer Status</h2>
                      <CustomerStatus customer={customer} />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <CustomerTimeline customerId={customer.id} />
                </div>
              </div>
            ),
          },
          {
            label: "Orders",
            content: <CustomerOrders customerId={customer.id} />,
          },
          {
            label: "Chats",
            content: <CustomerChats customerId={customer.id} />,
          },
          {
            label: "Products",
            content: (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ProductsNotOrdered customerId={customer.id} />
                <RecommendedProducts customerId={customer.id} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
