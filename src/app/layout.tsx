// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "react-hot-toast";
import ClientLayout from "../components/ClientLayout";
import SteelLayout from "@/components/layouts/SteelLayout"; // ✅ Apply steel wrapper globally

export const metadata: Metadata = {
  title: "ZeroLagHub",
  description: "Seamless hosting for open-source, indie, RPG, and modded game servers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="antialiased text-foreground min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <SteelLayout>
            <ClientLayout>{children}</ClientLayout>
          </SteelLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
