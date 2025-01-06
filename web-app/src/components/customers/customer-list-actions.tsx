import { Menu } from "@headlessui/react";
import {
  ArrowDownCircleIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export function CustomerActions({ customerId }: { customerId: string }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="btn btn-ghost btn-sm">
        <ArrowDownCircleIcon className="h-5 w-5" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/customers/${customerId}`}
                className={`${
                  active ? "bg-primary text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <InformationCircleIcon
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                View Details
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/c?customerId=${customerId}`}
                className={`${
                  active ? "bg-primary text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <ChatBubbleLeftIcon
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                Start Chat
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-primary text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => {
                  /* Implement edit functionality */
                }}
              >
                <PencilIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                Edit Customer
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
