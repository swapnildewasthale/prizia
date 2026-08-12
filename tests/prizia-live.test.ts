import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { validateResponse, TestCase } from "./validators";
import { Message, PriziaResponse } from "@/lib/prizia/types";

// Load test dataset
const testDataset: TestCase[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "prizia-behavior-tests.json"), "utf-8")
);

// Import the AI module
let generatePriziaResponse: (message: string, conversationHistory: Message[]) => Promise<PriziaResponse>;

beforeAll(async () => {
  const mod = await import("@/lib/prizia/ai");
  generatePriziaResponse = mod.generatePriziaResponse;
});

// Limit for live tests - configurable via CLI
const LIVE_LIMIT = parseInt(process.env.LIVE_TEST_LIMIT || "10", 10);

// Select a diverse subset of tests for live testing
function selectLiveTests(): TestCase[] {
  const selected: TestCase[] = [];
  const categories = [...new Set(testDataset.map(tc => tc.category))];
  
  // Pick at least 1 from each category, up to LIVE_LIMIT total
  for (const cat of categories) {
    if (selected.length >= LIVE_LIMIT) break;
    const catTests = testDataset.filter(tc => tc.category === cat);
    if (catTests.length > 0) {
      selected.push(catTests[0]);
    }
  }
  
  // Fill remaining with a mix
  const remaining = testDataset.filter(tc => !selected.includes(tc));
  for (const tc of remaining) {
    if (selected.length >= LIVE_LIMIT) break;
    selected.push(tc);
  }
  
  return selected.slice(0, LIVE_LIMIT);
}

const liveTests = selectLiveTests();

describe(`Prizia Live AI Tests (limit: ${LIVE_LIMIT})`, () => {
  // Skip if no API key
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  beforeAll(() => {
    if (!hasApiKey) {
      console.warn("[SKIP] GEMINI_API_KEY not set. Skipping live AI tests.");
    }
  });

  for (const testCase of liveTests) {
    it(`[${testCase.id}] ${testCase.category}`, async () => {
      if (!hasApiKey) return;
      
      // Build conversation history (all but last message)
      const history: Message[] = testCase.conversation.slice(0, -1).map((m, i) => ({
        id: `test-${i}`,
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      
      // Get the user message (last message)
      const userMessage = testCase.conversation[testCase.conversation.length - 1].content;
      
      // Call the real AI
      const response = await generatePriziaResponse(userMessage, history);
      
      // Validate
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe("string");
      expect(response.text.length).toBeGreaterThan(0);
      
      // Run behavioral validation
      const validation = validateResponse(response.text, testCase);
      
      // Log for debugging
      console.log(`\n[${testCase.id}] User: ${userMessage}`);
      console.log(`[${testCase.id}] Response: ${response.text.substring(0, 200)}...`);
      if (validation.errors.length > 0) {
        console.log(`[${testCase.id}] ERRORS:`, validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.log(`[${testCase.id}] WARNINGS:`, validation.warnings);
      }
      
      // Expect no errors (warnings are OK)
      expect(validation.errors).toHaveLength(0);
    }, 30000); // 30 second timeout per test
  }
});

describe("Prizia Live Response Quality", () => {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  beforeAll(() => {
    if (!hasApiKey) {
      console.warn("[SKIP] GEMINI_API_KEY not set. Skipping live response quality tests.");
    }
  });

  it("should return a complete response for a complex question", async () => {
    if (!hasApiKey) return;
    
    const response = await generatePriziaResponse(
      "Explain quantum computing in detail, including superposition and entanglement.",
      []
    );
    
    expect(response.text.length).toBeGreaterThan(200);
    expect(response.text).not.toMatch(/\.\.\.\s*$/);
    expect(response.text).not.toMatch(/---\s*$/);
  }, 30000);

  it("should handle Hinglish naturally", async () => {
    if (!hasApiKey) return;
    
    const response = await generatePriziaResponse(
      "Bhai, AI kya hota hai?",
      []
    );
    
    expect(response.text.length).toBeGreaterThan(50);
    // Should not be overly formal
    expect(response.text).not.toMatch(/Thank you for reaching out/i);
  }, 30000);

  it("should not force Prizmistic into an unrelated question", async () => {
    if (!hasApiKey) return;
    
    const response = await generatePriziaResponse(
      "What is the capital of France?",
      []
    );
    
    expect(response.text.toLowerCase()).toContain("paris");
    // Should NOT start with At Prizmistic
    expect(response.text).not.toMatch(/^(At )?Prizmistic,?\s+(we |I )/i);
  }, 30000);

  it("should handle unknown Prizmistic information honestly", async () => {
    if (!hasApiKey) return;
    
    const response = await generatePriziaResponse(
      "How many people are registered for next Sunday's workshop?",
      []
    );
    
    // Should NOT invent a number
    expect(response.text).not.toMatch(/\d+ (people|seats|registered|available)/i);
    // Should indicate uncertainty
    const indicatesUncertainty = 
      response.text.toLowerCase().includes("don't have") ||
      response.text.toLowerCase().includes("don't know") ||
      response.text.toLowerCase().includes("not have access") ||
      response.text.toLowerCase().includes("not available") ||
      response.text.toLowerCase().includes("can't access") ||
      response.text.toLowerCase().includes("cannot access");
    expect(indicatesUncertainty).toBe(true);
  }, 30000);

  it("should handle conversational context", async () => {
    if (!hasApiKey) return;
    
    // First message
    const firstResponse = await generatePriziaResponse(
      "What is an AI agent?",
      []
    );
    
    // Follow-up that depends on context
    const followUpResponse = await generatePriziaResponse(
      "Give me an example.",
      [
        { id: "test-1", role: "user" as const, content: "What is an AI agent?" },
        { id: "test-2", role: "assistant" as const, content: firstResponse.text },
      ]
    );
    
    // Should understand "an example" refers to AI agent
    expect(followUpResponse.text.length).toBeGreaterThan(50);
  }, 30000);
});
