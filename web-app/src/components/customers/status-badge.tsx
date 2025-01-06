import { Customer } from "../../lib/types";

const statusColors: { [key: string]: string } = {
  Basal: "badge-success",
  Fugado: "badge-warning",
  // Add more status colors as needed
};

export function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <div className={`badge ${statusColors[status || "Basal"] || "badge-info"}`}>
      {status}
    </div>
  );
}
