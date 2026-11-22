import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar, Footer } from "@/components/common";
import ToasterProvider from "@/components/common/ToasterProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EquipHub | Smart Equipment Rental Platform",
  description:
    "Rent heavy machinery, power tools, farming, and event tech equipment safely and seamlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <AuthProvider>
            <ToasterProvider />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1 flex flex-col">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
