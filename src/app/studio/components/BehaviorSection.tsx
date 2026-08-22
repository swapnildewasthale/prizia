"use client";

import { PriziaBehavior } from "@/lib/studio/types";
import { TextField } from "./TextField";

export function BehaviorSection({
  behavior,
  onChange,
}: {
  behavior: PriziaBehavior;
  onChange: (b: PriziaBehavior) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-[family-name:var(--font-audiowide)] text-lg text-[#FFF2DB]">
        Behavior
      </h2>
      <p className="text-sm text-[#FFF2DB]/40">
        Instructions controlling how Prizia behaves in conversation.
      </p>
      <TextField
        label="Answer Directness"
        value={behavior.answerDirectness}
        onChange={(v) => onChange({ ...behavior, answerDirectness: v })}
        multiline
      />
      <TextField
        label="Challenge Assumptions"
        value={behavior.challengeAssumptions}
        onChange={(v) => onChange({ ...behavior, challengeAssumptions: v })}
        multiline
      />
      <TextField
        label="Ask Questions"
        value={behavior.askQuestions}
        onChange={(v) => onChange({ ...behavior, askQuestions: v })}
        multiline
      />
      <TextField
        label="Handle Uncertainty"
        value={behavior.handleUncertainty}
        onChange={(v) => onChange({ ...behavior, handleUncertainty: v })}
        multiline
      />
      <TextField
        label="Connect to Prizmistic"
        value={behavior.connectToPrizmistic}
        onChange={(v) => onChange({ ...behavior, connectToPrizmistic: v })}
        multiline
      />
      <TextField
        label="Custom Instructions"
        value={behavior.customInstructions}
        onChange={(v) => onChange({ ...behavior, customInstructions: v })}
        multiline
        placeholder="Any additional behavior rules..."
      />
    </div>
  );
}
