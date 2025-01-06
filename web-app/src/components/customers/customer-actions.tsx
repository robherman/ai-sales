"use client";

import {
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  PhoneXMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export function CustomerActions({ customerId }: { customerId: string }) {
  return (
    <div className="flex space-x-2">
      <button
        className="btn btn-circle btn-sm"
        onClick={() => alert("Send email")}
      >
        <EnvelopeIcon className="h-4 w-4" />
      </button>
      <button
        className="btn btn-circle btn-sm"
        onClick={() => alert("Call customer")}
      >
        <PhoneXMarkIcon className="h-4 w-4" />
      </button>
      <Link
        href={`/c?customerId=${customerId}`}
        className="btn btn-circle btn-sm"
      >
        <ChatBubbleLeftIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
