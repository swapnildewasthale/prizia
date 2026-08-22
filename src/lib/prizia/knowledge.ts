// Parse the markdown into sections
interface Section {
  id: string;
  title: string;
  content: string;
  keywords: string[];
}

function parsePriziaMd(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split("\n");
  let currentSection: Section | null = null;

  for (const line of lines) {
    // Match section headers like "# 2. What Is Prizmistic?" or "# 37. Photography Workshop"
    const headerMatch = line.match(/^#\s+(\d+)\.\s+(.+)/);
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: headerMatch[1],
        title: headerMatch[2],
        content: "",
        keywords: extractKeywords(headerMatch[2]),
      };
    } else if (currentSection) {
      currentSection.content += line + "\n";
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const keywords: string[] = [];

  // Common words to ignore
  const stopWords = new Set(["the", "a", "an", "is", "are", "of", "and", "or", "to", "in", "for", "what", "how", "why", "when", "where", "who"]);

  const words = lower.split(/[\s,.-]+/).filter((w) => w.length > 2 && !stopWords.has(w));
  keywords.push(...words);

  return keywords;
}

// Cache for parsed sections
let cachedSections: Section[] | null = null;

// Load and parse prizia.md from public folder
async function loadPriziaMd(): Promise<Section[]> {
  if (cachedSections) {
    return cachedSections;
  }

  // During SSR/build, return empty array - will be loaded on client
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const response = await fetch("/prizia.md");
    const content = await response.text();
    cachedSections = parsePriziaMd(content);
    return cachedSections;
  } catch (error) {
    console.error("Failed to load prizia.md:", error);
    return [];
  }
}

// Initialize sections (will be populated async)
let sections: Section[] = [];

// Initialize on module load
loadPriziaMd().then((loadedSections) => {
  sections = loadedSections;
});

// Search function to find relevant sections
export async function searchKnowledgeAsync(query: string): Promise<Section[]> {
  // Ensure sections are loaded
  if (sections.length === 0) {
    sections = await loadPriziaMd();
  }

  const lower = query.toLowerCase();
  const words = lower.split(/[\s,.-]+/).filter((w) => w.length > 2);

  // Check for specific workshop queries
  const isPhotographyWorkshopQuery = /photo|camera|lens|exposure|aperture|composition|lighting|portrait|street|landscape|editing|lightroom|photoshop|image|visual|picture|shoot|frame|focus/.test(lower);
  const isMusicWorkshopQuery = /music|song|sing|play|instrument|guitar|piano|drum|rhythm|melody|harmony|chord|beat|sound|audio|record|compose|lyric|voice|band|concert|perform|improvise|listen/.test(lower);
  const isAIWorkshopQuery = /\bai\b|artificial|machine learn|deep learn|neural|generat|prompt|model|train|algorithm|agent|chatbot|llm|nlp|large language/.test(lower);
  const isWorkshopQuery = /workshop|class|session|course|learn|teach|instruct|facilitat/.test(lower);

  const scored = sections.map((section) => {
    let score = 0;
    const sectionLower = (section.title + " " + section.content).toLowerCase();
    const sectionId = section.id;

    // Boost specific workshop sections
    if (isPhotographyWorkshopQuery && sectionId === "38") {
      score += 10; // Photography Workshop section
    }
    if (isMusicWorkshopQuery && sectionId === "39") {
      score += 10; // Music Workshop section
    }
    if (isAIWorkshopQuery && sectionId === "9") {
      score += 10; // AI Workshop section
    }

    // Check title match
    for (const word of words) {
      if (section.title.toLowerCase().includes(word)) {
        score += 3;
      }
      if (section.keywords.some((k) => k.includes(word) || word.includes(k))) {
        score += 2;
      }
      if (sectionLower.includes(word)) {
        score += 1;
      }
    }

    return { section, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.section);
}

// Synchronous version for when sections are already loaded
export function searchKnowledge(query: string): Section[] {
  const lower = query.toLowerCase();
  const words = lower.split(/[\s,.-]+/).filter((w) => w.length > 2);

  // Check for specific workshop queries
  const isPhotographyWorkshopQuery = /photo|camera|lens|exposure|aperture|composition|lighting|portrait|street|landscape|editing|lightroom|photoshop|image|visual|picture|shoot|frame|focus/.test(lower);
  const isMusicWorkshopQuery = /music|song|sing|play|instrument|guitar|piano|drum|rhythm|melody|harmony|chord|beat|sound|audio|record|compose|lyric|voice|band|concert|perform|improvise|listen/.test(lower);
  const isAIWorkshopQuery = /\bai\b|artificial|machine learn|deep learn|neural|generat|prompt|model|train|algorithm|agent|chatbot|llm|nlp|large language/.test(lower);
  const isWorkshopQuery = /workshop|class|session|course|learn|teach|instruct|facilitat/.test(lower);

  const scored = sections.map((section) => {
    let score = 0;
    const sectionLower = (section.title + " " + section.content).toLowerCase();
    const sectionId = section.id;

    // Boost specific workshop sections
    if (isPhotographyWorkshopQuery && sectionId === "38") {
      score += 10; // Photography Workshop section
    }
    if (isMusicWorkshopQuery && sectionId === "39") {
      score += 10; // Music Workshop section
    }
    if (isAIWorkshopQuery && sectionId === "9") {
      score += 10; // AI Workshop section
    }

    // Check title match
    for (const word of words) {
      if (section.title.toLowerCase().includes(word)) {
        score += 3;
      }
      if (section.keywords.some((k) => k.includes(word) || word.includes(k))) {
        score += 2;
      }
      if (sectionLower.includes(word)) {
        score += 1;
      }
    }

    return { section, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.section);
}

// Get a specific section by number
export function getSection(num: string): Section | undefined {
  return sections.find((s) => s.id === num);
}

// Get all sections
export function getAllSections(): Section[] {
  return sections;
}

// Check if a topic is an active domain
export function isActiveDomain(topic: string): boolean {
  const lower = topic.toLowerCase();
  const activeDomainsSection = sections.find((s) => s.id === "40");
  if (activeDomainsSection) {
    return activeDomainsSection.content.toLowerCase().includes(lower);
  }
  return false;
}

// Get active domains
export function getActiveDomains(): string[] {
  const activeDomainsSection = sections.find((s) => s.id === "40");
  if (activeDomainsSection) {
    const content = activeDomainsSection.content;
    const domains: string[] = [];
    
    // Check for domains in the content (both in and outside code blocks)
    if (content.includes("AI")) domains.push("AI");
    if (content.includes("Photography")) domains.push("Photography");
    if (content.includes("Music")) domains.push("Music");
    
    return domains.length > 0 ? domains : ["AI"];
  }
  return ["AI"];
}

// Force reload knowledge (useful for testing)
export async function reloadKnowledge(): Promise<void> {
  cachedSections = null;
  sections = await loadPriziaMd();
}
