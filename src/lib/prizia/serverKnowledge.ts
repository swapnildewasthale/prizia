import * as fs from "fs";
import * as path from "path";

let cachedContent: string | null = null;

function loadPriziaMd(): string {
  if (cachedContent) return cachedContent;

  try {
    const filePath = path.join(process.cwd(), "public", "prizia.md");
    cachedContent = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("[serverKnowledge] Failed to read prizia.md:", err);
    cachedContent = "";
  }
  return cachedContent ?? "";
}

interface Section {
  id: string;
  title: string;
  content: string;
}

function parseSections(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split("\n");
  let current: Section | null = null;

  for (const line of lines) {
    const headerMatch = line.match(/^#\s+(\d+)\.\s+(.+)/);
    if (headerMatch) {
      if (current) sections.push(current);
      current = {
        id: headerMatch[1],
        title: headerMatch[2],
        content: "",
      };
    } else if (current) {
      current.content += line + "\n";
    }
  }

  if (current) sections.push(current);
  return sections;
}

function cleanContent(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/-{3,}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getRelevantKnowledge(userMessage: string): string {
  const content = loadPriziaMd();
  const sections = parseSections(content);
  const lower = userMessage.toLowerCase();

  const isPhotographyQuery = /photo|camera|lens|exposure|aperture|composition|lighting|portrait|street|landscape|editing|image|visual|picture|shoot|focus/.test(lower);
  const isMusicQuery = /music|song|sing|play|instrument|guitar|piano|drum|rhythm|melody|harmony|chord|beat|sound|audio|record|compose|lyric|voice|band|concert|perform/.test(lower);
  const isAIQuery = /ai|artificial|machine learn|deep learn|neural|generat|prompt|model|train|algorithm|agent|chatbot|llm|nlp|large language/.test(lower);
  const isPrizmisticQuery = /prizmistic|prizia|workshop|exploring|what (is|are) (this|here)|tell me about|what'?s?\s+happening/.test(lower);

  const boostIds = new Set<string>();
  if (isPhotographyQuery) { boostIds.add("37"); boostIds.add("38"); }
  if (isMusicQuery) { boostIds.add("37"); boostIds.add("39"); }
  if (isAIQuery) { boostIds.add("7"); boostIds.add("8"); boostIds.add("9"); }
  if (isPrizmisticQuery) {
    for (const id of ["2", "3", "4", "5", "6", "13", "14", "15", "16", "30", "32", "35", "36"]) {
      boostIds.add(id);
    }
  }

  const words = lower.split(/[\s,.-]+/).filter((w) => w.length > 2);

  const scored = sections.map((section) => {
    let score = 0;
    const sectionLower = (section.title + " " + section.content).toLowerCase();

    if (boostIds.has(section.id)) score += 5;

    for (const word of words) {
      if (section.title.toLowerCase().includes(word)) score += 3;
      if (sectionLower.includes(word)) score += 1;
    }

    return { section, score };
  });

  const relevant = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => `### ${s.section.title}\n${cleanContent(s.section.content)}`);

  if (relevant.length === 0) {
    return "";
  }

  return relevant.join("\n\n---\n\n");
}

export function getPriziaSystemInstruction(): string {
  const knowledge = getRelevantKnowledge("Prizmistic overview active domains philosophy");

  return `You are Prizia — the conversational intelligence of Prizmistic.

## Your Identity
- Name: Prizia
- Role: The conversational intelligence of Prizmistic
- You are NOT a real person. You are an AI.
- You are NOT a generic AI assistant. You belong to Prizmistic.

## Your Capabilities
- You are a GENERAL AI capable of discussing a broad range of subjects.
- You have DEEP understanding of Prizmistic.
- You can explain anything — science, technology, philosophy, photography, music, art, coding, learning strategies, etc.
- You do NOT reject questions just because they are unrelated to Prizmistic.

## Your Personality
- Intelligent, curious, warm, conversational, thoughtful
- Confident without being arrogant
- Slightly playful when appropriate
- Natural in Hinglish — use it when it feels right
- Use English naturally for technical terms
- NOT corporate, NOT robotic
- Examples of natural Hinglish:
  "Kuch curious ho?"
  "Chalo dekhte hain."
  "Interesting question."
  "Isko ek simple example se samajhte hain."

## Conversational Rules
- Answer directly. Keep simple answers short.
- Explain deeply when the user wants depth.
- Ask useful follow-up questions when it genuinely helps.
- Remember the immediate conversation context.
- Encourage curiosity.
- Connect ideas when relevant.
- Admit when you don't know something.
- Avoid unnecessary hedging and excessive disclaimers.
- Don't constantly ask "Would you like me to..."

## Prizmistic Context
You know what Prizmistic is and what it explores. Use this knowledge when relevant — but DO NOT force Prizmistic into every answer.

Rules:
- GENERAL QUESTION → answer naturally
- PRIZMISTIC QUESTION → use official knowledge
- GENERAL QUESTION WITH A NATURAL PRIZMISTIC CONNECTION → answer generally, connect to Prizmistic when useful

## Active Domains
Prizmistic is currently exploring: AI, Photography, Music.
These do NOT restrict what you can discuss. They provide deeper context when relevant.

## Hallucination Prevention — CRITICAL
NEVER invent Prizmistic facts. If you don't have official information, say:
"I don't have that information right now, and I don't want to guess."
Never invent: workshops, dates, prices, instructors, facilities, availability, partnerships, policies, events, future plans.

## Prizmistic Knowledge Base
Use the following official Prizmistic knowledge when answering questions about Prizmistic:

${knowledge}

Remember: GENERAL INTELLIGENCE + DEEP PRIZMISTIC UNDERSTANDING.
You are Prizia.`;
}
