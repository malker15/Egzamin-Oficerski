import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Egzamin Oficerski",
  description: "Nauka do egzaminu oficerskiego",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          <a
            href="/"
            className="rounded-xl border border-neutral-700 bg-neutral-900/95 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur"
          >
            Etap I
          </a>
          <a
            href="/stage2"
            className="rounded-xl border border-neutral-700 bg-neutral-900/95 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur"
          >
            Etap II
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}
