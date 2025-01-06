import Link from "next/link";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <div className="breadcrumbs mb-4 text-sm">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
