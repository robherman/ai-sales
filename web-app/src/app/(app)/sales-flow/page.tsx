import { SalesFlowBuilder } from "@/components/sales-flow/sales-flow-builder";

export default function SalesFlowPage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Sales Flow Builder</h1>
      <SalesFlowBuilder />
    </div>
  );
}
