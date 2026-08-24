"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { WebsiteConfig } from "@/lib/website/types";

interface ConditionalFooterProps {
  footerConfig?: WebsiteConfig["footer"];
}

export default function ConditionalFooter({ footerConfig }: ConditionalFooterProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/prizia") || pathname.startsWith("/prizm")) return null;
  return <Footer footer={footerConfig} />;
}
