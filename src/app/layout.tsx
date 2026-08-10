import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PriziaShell from "@/components/prizia/PriziaShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Prizia — The Intelligence of Prizmistic",
  description:
    "Prizia is the conversational intelligence of Prizmistic. She knows what is happening at Prizmistic and can deeply explore the subjects that Prizmistic is currently learning, teaching, making, or organizing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
