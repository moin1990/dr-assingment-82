import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: "Tile Gallery — Curated Art & Design",
    template: "%s | Tile Gallery",
  },
  description:
    "A curated collection of exceptional tiles, patterns, and architectural ceramics from around the world.",
  keywords: ["tiles", "gallery", "ceramics", "patterns", "art", "design"],
  openGraph: {
    title: "Tile Gallery — Curated Art & Design",
    description: "Exceptional tiles and patterns from around the world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="gallery" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-base-100 text-base-content">
        <ToastProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
