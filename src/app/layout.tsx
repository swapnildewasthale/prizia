import type { Metadata } from "next";
import { Audiowide, Comfortaa } from "next/font/google";
import ConditionalFooter from "@/components/prizia/ConditionalFooter";
import { FormModalProvider } from "@/components/prizia/FormModalContext";
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
  title: "Prizmistic — Learn, Make, Explore",
  description:
    "Prizmistic ek aisi jagah hai jahan aap kuch seekh sakte hain, kuch bana sakte hain, ya bas kisi idea ko explore kar sakte hain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className={`${audiowide.variable} ${comfortaa.variable} font-sans antialiased`}>
        <FormModalProvider>
          {children}
          <ConditionalFooter />
        </FormModalProvider>
      </body>
    </html>
  );
}
