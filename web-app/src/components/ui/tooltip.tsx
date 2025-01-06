import { ReactNode } from "react";

export function Tooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) {
  return (
    <div className="tooltip" data-tip={content}>
      {children}
    </div>
  );
}
