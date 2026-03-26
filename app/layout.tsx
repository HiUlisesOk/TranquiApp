import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastStoreProvider } from "@/components/ui/use-toast";

export const metadata: Metadata = {
  title: "TranquiApp",
  description: "Gestión financiera personal en español"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ToastStoreProvider>
          {children}
          <Toaster />
        </ToastStoreProvider>
      </body>
    </html>
  );
}
