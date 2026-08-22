import { PriziaConfig } from "@/lib/studio/types";
import { defaultConfig } from "@/lib/studio/defaults";
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

interface Section { id: string; title: string; content: string; }

function parseSections(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split("\n");
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
  const isPhotoQuery = /photo|camera|lens|exposure|aperture|composition|lighting|portrait|street|landscape|editing|image|visual|picture|shoot|focus/.test(lower);
  const isMusicQuery = /music|song|sing|play|instrument|guitar|piano|drum|rhythm|melody|harmony|chord|beat|sound|audio|record|compose|lyric|voice|band|concert|perform/.test(lower);
  const isAIQuery = /\bai\b|artificial|machine learn|deep learn|neural|generat|prompt|model|train|algorithm|agent|chatbot|llm|nlp|large language/.test(lower);
  const isPrizQuery = /prizmistic|prizia|workshop|exploring|what (is|are) (this|here)|tell me about/.test(lower);
  const boostIds = new Set<string>();
  if (isPhotoQuery) { boostIds.add("37"); boostIds.add("38"); boostIds.add("40"); }
  if (isMusicQuery) { boostIds.add("37"); boostIds.add("39"); boostIds.add("40"); }
  if (isAIQuery) { boostIds.add("7"); boostIds.add("8"); boostIds.add("9"); boostIds.add("40"); }
  if (isPrizQuery) { for (const id of ["2","3","4","5","6","13","14","15","16","30","32","35","36","40"]) { boostIds.add(id); } }
  const words = lower.split(/[\s,.-]+/).filter((w) => w.length > 2);
  const wordRegexes = words.map((w) => new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"));
  const scored = sections.map((section) => {
    let score = 0;
    const sectionLower = (section.title + " " + section.content).toLowerCase();
    const titleLower = section.title.toLowerCase();
    if (boostIds.has(section.id)) score += 5;
    for (const regex of wordRegexes) {
      if (regex.test(titleLower)) score += 3;
      if (regex.test(sectionLower)) score += 1;
    }
    return { section, score };
  });
  const relevant = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map((s) => "### " + s.section.title + "\n" + cleanContent(s.section.content));
  return relevant.length === 0 ? "" : relevant.join("\n\n---\n\n");
}

export function buildSystemInstructionFromConfig(config: PriziaConfig, knowledge: string): string {
  const { identity, behavior, communication } = config;
  const activeKnowledgeEntries = config.knowledge.filter((k) => k.active).map((k) => "### " + k.title + "\n" + k.content).join("\n\n---\n\n");
  const extraKnowledge = activeKnowledgeEntries ? "\n\n## Additional Knowledge\n\n" + activeKnowledgeEntries : "";
  const parts: string[] = [];
  parts.push("You are " + identity.name + " \u2014 " + identity.role + ".\n");
  parts.push("## Your Identity\n- Name: " + identity.name + "\n- Role: " + identity.role + "\n- Purpose: " + identity.purpose + "\n- You are NOT a real person. You are an AI.\n- You are NOT a generic AI assistant. You belong to Prizmistic.\n- You are a GENERAL-PURPOSE conversational AI with deep understanding of Prizmistic.\n");
  parts.push("## BE INTELLIGENT FIRST \u2014 CRITICAL\n" + behavior.answerDirectness + "\n");
  parts.push("## Your Capabilities\n- You are a GENERAL AI capable of discussing a broad range of subjects.\n- You have DEEP understanding of Prizmistic.\n- You can explain anything \u2014 science, technology, philosophy, photography, music, art, coding, learning strategies, etc.\n- You do NOT reject questions just because they are unrelated to Prizmistic.\n");
  parts.push("## Your Personality\n" + communication.tone + "\n");
  parts.push("## Language Rules\n" + communication.languageBehavior + "\n" + communication.hinglishHandling + "\n");
  parts.push("## Response Style\n" + communication.responseStyle + "\n");
  parts.push("## RESPONSE LENGTH\n" + communication.responseLength + "\n");
  parts.push("## Behavior Rules\n" + behavior.challengeAssumptions + "\n\n" + behavior.askQuestions + "\n\n" + behavior.handleUncertainty + "\n\n" + behavior.connectToPrizmistic + "\n\n" + behavior.customInstructions + "\n");
  parts.push("## Conversational Rules\n- Answer directly. Keep simple answers short.\n- Explain deeply when the user wants depth.\n- Ask useful follow-up questions when it genuinely helps.\n- Remember the immediate conversation context.\n- Encourage curiosity.\n- Connect ideas when relevant.\n- Admit when you don't know something.\n- Avoid unnecessary hedging and excessive disclaimers.\n- Don't constantly ask \"Would you like me to...\"\n\n## DO NOT PRETEND TO HAVE PERSONAL EXPERIENCE\nNever claim you personally attended a workshop, used a physical space, met someone, saw something, or experienced something.\n\n## DO NOT CLAIM PERSISTENT MEMORY\nDo not claim persistent memory across sessions. Conversation context within the current session CAN be used.\n\n## Hallucination Prevention \u2014 CRITICAL\nNEVER invent Prizmistic facts. If you don't have official information, say: \"I don't have that information right now, and I don't want to guess.\"\nNever invent: workshops, dates, prices, instructors, facilities, availability, partnerships, policies, events, future plans.\n\n## UNKNOWN INFORMATION \u2014 HONEST HANDLING\n- Prizmistic information unavailable: \"I don't have that information right now.\"\n- Live/current data required: \"I don't have live access to that right now.\"\n- General knowledge uncertain: \"I'm not certain about that.\"\n- NEVER fabricate.\n");
  parts.push("## Prizmistic Knowledge Base\nUse the following official Prizmistic knowledge when answering questions about Prizmistic:\n\n" + knowledge + extraKnowledge + "\n\nRemember: GENERAL INTELLIGENCE + DEEP PRIZMISTIC UNDERSTANDING.\nBe intelligent first. Prizmistic when relevant. Never force it.\nYou are " + identity.name + ".");
  return parts.join("\n");
}

export async function getPriziaSystemInstructionAsync(userMessage: string): Promise<string> {
  let config = defaultConfig;
  try {
    const { getPublishedConfig } = await import("@/lib/studio/storage");
    config = await getPublishedConfig();
  } catch {
    console.warn("[serverKnowledge] Could not load published config, using defaults");
  }
  const knowledge = getRelevantKnowledge(userMessage);
  return buildSystemInstructionFromConfig(config, knowledge);
}

export function getPriziaSystemInstruction(): string {
  const knowledge = getRelevantKnowledge("Prizmistic overview active domains philosophy");
  return buildSystemInstructionFromConfig(defaultConfig, knowledge);
}
