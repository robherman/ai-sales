import "../styles/globals.css";
import type { Metadata } from "next";
import { Tilt_Neon } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "../components/providers";
import ErrorBoundary from "../components/error-boundary";

const tilt = Tilt_Neon({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Frozen - AI Chatbot",
  description: "An AI-powered chatbot demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body className={tilt.className}>
        <ErrorBoundary>
          <Providers>
            {children}
            <Analytics />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
