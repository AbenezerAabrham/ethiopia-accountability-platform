import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Egna (እኛ) — Ethiopia Accountability, Learning & Community Platform",
  description: "Connect with peers, track daily habit routines, participate in Ethiopian skill challenges, and build accountability together.",
  keywords: ["Egna", "Ethiopia", "Accountability", "Community", "Habits", "Programming Ethiopia", "Fitness Ethiopia", "Addis Ababa Tech"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark font-sans antialiased">
      <body className="dark">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
