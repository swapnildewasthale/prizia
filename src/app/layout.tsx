import type { Metadata } from "next";
import { Audiowide, Comfortaa } from "next/font/google";
import "./globals.css";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-audiowide",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-comfortaa",
  display: "swap",
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
      <body className={`${audiowide.variable} ${comfortaa.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
