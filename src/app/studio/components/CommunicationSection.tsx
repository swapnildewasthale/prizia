"use client";

import { PriziaCommunication } from "@/lib/studio/types";
import { TextField } from "./TextField";

export function CommunicationSection({
  communication,
  onChange,
}: {
  communication: PriziaCommunication;
  onChange: (c: PriziaCommunication) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
        Communication
      </h2>
      <p className="text-sm text-[#FFF2DB]/40">
        Language, tone, and response style settings.
      </p>
      <TextField
        label="Language Behavior"
        value={communication.languageBehavior}
        onChange={(v) => onChange({ ...communication, languageBehavior: v })}
        multiline
      />
      <TextField
        label="Hinglish Handling"
        value={communication.hinglishHandling}
        onChange={(v) => onChange({ ...communication, hinglishHandling: v })}
        multiline
      />
      <TextField
        label="Tone"
        value={communication.tone}
        onChange={(v) => onChange({ ...communication, tone: v })}
        multiline
      />
      <TextField
        label="Response Style"
        value={communication.responseStyle}
        onChange={(v) => onChange({ ...communication, responseStyle: v })}
        multiline
      />
      <TextField
        label="Response Length"
        value={communication.responseLength}
        onChange={(v) => onChange({ ...communication, responseLength: v })}
        multiline
      />
    </div>
  );
}
