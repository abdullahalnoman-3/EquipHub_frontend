import type { Metadata } from "next";
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
