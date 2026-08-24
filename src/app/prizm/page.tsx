import type { Metadata } from "next";
import PrizmShell from "@/components/prizia/PrizmShell";

export const metadata: Metadata = {
  title: "PRIZM — Put it through the prism | Prizmistic",
  description:
    "Take one thing and discover multiple interesting ways of seeing or exploring it. PRIZM splits any input into multiple perspectives.",
};

export default function PrizmPage() {
  return <PrizmShell />;
}
