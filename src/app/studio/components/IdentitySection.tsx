"use client";

import { PriziaIdentity } from "@/lib/studio/types";
import { TextField } from "./TextField";

export function IdentitySection({
  identity,
  onChange,
}: {
  identity: PriziaIdentity;
  onChange: (i: PriziaIdentity) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
        Identity
      </h2>
      <p className="text-sm text-[#FFF2DB]/40">
        Prizia&apos;s fundamental identity and purpose.
      </p>
      <TextField
        label="Name"
        value={identity.name}
        onChange={(v) => onChange({ ...identity, name: v })}
      />
      <TextField
        label="Role"
        value={identity.role}
        onChange={(v) => onChange({ ...identity, role: v })}
        placeholder="e.g. The conversational intelligence of Prizmistic"
      />
      <TextField
        label="Purpose"
        value={identity.purpose}
        onChange={(v) => onChange({ ...identity, purpose: v })}
        multiline
        placeholder="What is Prizia's core purpose?"
      />
    </div>
  );
}
