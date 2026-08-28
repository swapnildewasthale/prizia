import type { Metadata } from "next";
import ClarityShell from "@/components/prizia/ClarityShell";

export const metadata: Metadata = {
  title: "Clarity — Finish your thought | Prizmistic",
  description:
    "Turn vague intentions into clear requests. Clarity helps you find the right words for what you want to do.",
};

export default function ClarityPage() {
  return <ClarityShell />;
}
