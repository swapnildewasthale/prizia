import { describe, it, beforeAll } from "vitest";
import { expect } from "vitest";

let getRelevantKnowledge: (msg: string) => string;

beforeAll(async () => {
  const mod = await import("@/lib/prizia/serverKnowledge");
  getRelevantKnowledge = mod.getRelevantKnowledge;
});

const queries = [
  { label: "A: event query (Hindi)", query: "konse event ho rhe hain abhi?" },
  { label: "B: what can learn at Prizmistic", query: "Prizmistic mein kya kya seekh sakte hain?" },
  { label: "C: AI query", query: "AI mein kya hota hai?" },
  { label: "D: Photography query", query: "Photography ke baare mein batao" },
  { label: "E: Music workshop", query: "Music workshop kya hai?" },
];

describe("Word matching fix — whole-word regex", () => {
  for (const { label, query } of queries) {
    it(label, () => {
      const knowledge = getRelevantKnowledge(query);
      const sectionTitles = knowledge
        .split("\n")
        .filter((line) => line.startsWith("### "))
        .map((line) => line.replace("### ", ""));

      console.log(`\n[${label}]`);
      console.log(`  Query: "${query}"`);
      console.log(`  Retrieved: ${sectionTitles.length > 0 ? sectionTitles.join(" | ") : "(none)"}`);
    });
  }

  it("query A must NOT retrieve AI-specific sections", () => {
    const knowledge = getRelevantKnowledge("konse event ho rhe hain abhi?");
    // These section titles contain AI-specific content and should not appear
    const aiTitles = [
      "The First Exploration: Artificial Intelligence",
      "What the AI Experience Can Explore",
      "The AI Workshop",
    ];
    for (const title of aiTitles) {
      expect(knowledge).not.toContain(title);
    }
  });
});
