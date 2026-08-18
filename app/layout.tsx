import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StageDock from "../components/StageDock";
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
  description: "Trener przygotowania do egzaminu oficerskiego",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <StageDock />
      </body>
    </html>
  );
}
