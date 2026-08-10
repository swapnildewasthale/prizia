"use client";

import PriziaHeader from "./PriziaHeader";
import Conversation from "./Conversation";
import { Domain } from "@/lib/prizia/types";

const defaultDomains: Domain[] = [
  { id: "ai", name: "AI", active: true },
  { id: "clay", name: "Clay", active: false },
];

export default function PriziaShell() {
  return (
    <div className="min-h-screen bg-[#F7F7F9] flex flex-col">
      <PriziaHeader domains={defaultDomains} />
      <main className="flex-1 flex flex-col">
        <Conversation domains={defaultDomains} />
      </main>
    </div>
  );
}
