import {
  ClockIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Customer } from "../../lib/types";
import moment from "moment";

export function CustomerInfo({ customer }: { customer: Customer }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center">
        <InformationCircleIcon className="mr-2 h-4 w-4" />
        <span>
          {[customer.contactFirstName, customer.contactLastName].join(" ")}
        </span>
      </div>
      <div className="flex items-center">
        <EnvelopeIcon className="mr-2 h-4 w-4" />
        <span>{customer.email}</span>
      </div>
      <div className="flex items-center">
        <PhoneIcon className="mr-2 h-4 w-4" />
        <span>{customer.mobile}</span>
      </div>
      <div className="flex items-center">
        <MapPinIcon className="mr-2 h-4 w-4" />
        <span>{customer.fullAddress}</span>
      </div>
      <div className="flex items-center">
        <ClockIcon className="mr-2 h-4 w-4" />
        <span>
          {`Última compra: ${
            customer.lastPurchaseAt
              ? moment(customer.lastPurchaseAt).fromNow()
              : "N/A"
          }`}
        </span>
      </div>
    </div>
  );
}
