import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="drawer lg:drawer-open">
        <input
          id="left-side-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col">
          <Header />
          <main className="h-screen flex-1 overflow-hidden bg-base-200">
            {children}
          </main>
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
