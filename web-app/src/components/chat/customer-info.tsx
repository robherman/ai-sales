import Link from "next/link";
import { Customer, Order } from "../../lib/types";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import moment from "moment";

export const CustomerInfo = ({
  customer,
  lastOrder,
}: {
  customer: Customer;
  lastOrder?: Order | null;
}) => {
  if (!customer) {
    return <>Sin información de cliente</>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Info de Cliente</h3>
        <div className="space-y-2 text-sm">
          <InfoItem label="Nombre" value={customer.name} />
          <InfoItem label="Email" value={customer.email} />
          <InfoItem label="Teléfono" value={customer.mobile} />
          <InfoItem label="Dirección" value={customer.fullAddress} />
          <InfoItem label="Estado" value={customer.status} />
          <InfoItem
            label="Frecuencia Compra"
            value={customer.purchaseFrequencyDay}
          />
          <InfoItem label="ID Externo" value={customer.externalId} />
        </div>
      </div>
      {lastOrder && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Último pedido</h3>
          <div className="space-y-2 text-sm">
            <InfoItem label="Order ID" value={lastOrder.id} />
            <InfoItem
              label="Date"
              value={moment(lastOrder.orderDate).format("MMMM D, YYYY")}
            />
            <InfoItem
              label="Total"
              value={`$${Number(lastOrder.total || 0).toFixed(2)}`}
            />
            <div>
              <h4 className="mb-1 font-medium text-gray-600">Items:</h4>
              <ul className="list-inside list-disc">
                {lastOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function InfoItem({ label, value }: any) {
  return (
    <div>
      <span className="font-semibold text-gray-600">{label}: </span>
      <span>{value}</span>
    </div>
  );
}
