import { notFound, redirect } from "next/navigation";
import { Customer, Session } from "@/lib/types";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "../../../../lib/apis/customers";
import { CustomerDetail } from "../../../../components/customers/customer-detail";
import { Suspense } from "react";
import LoadingSpinner from "../../../../components/loading-spinner";
import { Breadcrumb } from "../../../../components/ui/breadcrumb";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const session = (await getSession()) as Session;
  if (!session?.user) {
    redirect(`/login?next=/customers/${params.id}`);
  }
  const customerPromise = getCustomerById(session?.token, params.id);

  return (
    <div className="p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <AsyncCustomerDetail customerPromise={customerPromise} />
      </Suspense>
    </div>
  );
}

async function AsyncCustomerDetail({
  customerPromise,
}: {
  customerPromise: Promise<Customer>;
}) {
  const customer = await customerPromise;
  if (!customer) {
    return notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Customers", href: "/customers" },
          { label: customer.name, href: `/customers/${customer.id}` },
        ]}
      />
      <CustomerDetail customer={customer} />
    </>
  );
}
