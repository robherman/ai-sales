"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "../lib/providers/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" theme="light" />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
