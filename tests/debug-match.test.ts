import { describe, it, beforeAll } from "vitest";

let getRelevantKnowledge: (msg: string) => string;

beforeAll(async () => {
  const mod = await import("@/lib/prizia/serverKnowledge");
  getRelevantKnowledge = mod.getRelevantKnowledge;
});

describe("deep debug", () => {
  it("trace scoring for query A", () => {
    // We need to reproduce the scoring logic manually to see what's happening
    const fs = require("fs");
    const path = require("path");
    const content = fs.readFileSync(path.join(process.cwd(), "public", "prizia.md"), "utf-8");

    interface Section { id: string; title: string; content: string; }
    function parseSections(c: string): Section[] {
      const sections: Section[] = [];
      const lines = c.split("\n");
      let current: Section | null = null;
      for (const line of lines) {
        const headerMatch = line.match(/^#\s+(\d+)\.\s+(.+)/);
        if (headerMatch) {
          if (current) sections.push(current);
          current = { id: headerMatch[1], title: headerMatch[2], content: "" };
        } else if (current) {
          current.content += line + "\n";
        }
      }
      if (current) sections.push(current);
      return sections;
    }

    const sections = parseSections(content);
    const query = "konse event ho rhe hain abhi?";
    const lower = query.toLowerCase();
    const words = lower.split(/[\s,.-]+/).filter((w) => w.length > 2);
    const wordRegexes = words.map((w) => {
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp("\\b" + escaped + "\\b");
    });

    console.log("Words:", words);
    console.log("Regex:", wordRegexes.map((r) => r.source));

    const scored = sections.map((section) => {
      let score = 0;
      const sectionLower = (section.title + " " + section.content).toLowerCase();
      const titleLower = section.title.toLowerCase();
      for (let i = 0; i < wordRegexes.length; i++) {
        if (wordRegexes[i].test(titleLower)) score += 3;
        if (wordRegexes[i].test(sectionLower)) score += 1;
      }
      return { id: section.id, title: section.title, score, matches: wordRegexes.filter(r => r.test(sectionLower)).map(r => r.source) };
    });

    const sorted = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
    console.log("\nAll sections with score > 0:");
    for (const s of sorted) {
      console.log(`  [${s.id}] score=${s.score} "${s.title}" matched: ${s.matches.join(", ")}`);
    }
  });
});
