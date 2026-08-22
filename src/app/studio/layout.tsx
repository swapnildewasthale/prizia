"use client";

import { StudioProvider } from "./components/StudioContext";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioProvider>{children}</StudioProvider>;
}
