import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  preload: true,
});

export const metadata: Metadata = {
  title: "CATATWA-LITE - Catat Keuangan Seperti Chat",
  description: "Aplikasi pencatatan keuangan sederhana untuk UMKM Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-green-700 focus:border focus:border-green-600 focus:rounded-md">
          Langsung ke konten utama
        </a>
        <Providers>
          <main id="main-content">
            {children}
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
