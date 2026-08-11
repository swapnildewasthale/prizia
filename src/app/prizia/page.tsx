import { Suspense } from "react";
import PriziaShell from "@/components/prizia/PriziaShell";

export default function PriziaPage() {
  return (
    <Suspense>
      <PriziaShell />
    </Suspense>
  );
}
