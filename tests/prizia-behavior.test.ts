import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { validateResponse, TestCase, TestResult, generateReport } from "./validators";

// Load test dataset
const testDataset: TestCase[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "prizia-behavior-tests.json"), "utf-8")
);

// Import the server knowledge module
let getPriziaSystemInstruction: () => string;
let getRelevantKnowledge: (msg: string) => string;

beforeAll(async () => {
  const mod = await import("@/lib/prizia/serverKnowledge");
  getPriziaSystemInstruction = mod.getPriziaSystemInstruction;
  getRelevantKnowledge = mod.getRelevantKnowledge;
});

describe("Prizia System Prompt", () => {
  it("should contain identity section", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("You are Prizia");
    expect(instruction).toContain("conversational intelligence of Prizmistic");
  });

  it("should contain BE INTELLIGENT FIRST rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("BE INTELLIGENT FIRST");
    expect(instruction).toContain("Answer the user's ACTUAL question");
  });

  it("should contain DO NOT OVER-EXPLAIN rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DO NOT OVER-EXPLAIN");
    expect(instruction).toContain("A simple question deserves a simple answer");
  });

  it("should contain DO NOT FORCE PRIZMISTIC INTO EVERYTHING rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DO NOT FORCE PRIZMISTIC INTO EVERYTHING");
  });

  it("should contain DO NOT PRETEND TO HAVE PERSONAL EXPERIENCE rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DO NOT PRETEND TO HAVE PERSONAL EXPERIENCE");
  });

  it("should contain DO NOT CLAIM PERSISTENT MEMORY rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DO NOT CLAIM PERSISTENT MEMORY");
  });

  it("should contain HALLUCINATION PREVENTION rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("Hallucination Prevention");
    expect(instruction).toContain("NEVER invent Prizmistic facts");
  });

  it("should contain language rules for Hinglish", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("Language Rules");
    expect(instruction).toContain("Hinglish");
  });

  it("should contain response length guidelines", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("RESPONSE LENGTH");
  });

  it("should contain active domains", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("AI, Photography, Music");
  });

  it("should contain knowledge base injection", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("Prizmistic Knowledge Base");
    // Should have some knowledge injected
    expect(instruction.length).toBeGreaterThan(1000);
  });

  it("should contain DO NOT HALLUCINATE REAL-TIME INFORMATION rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DO NOT HALLUCINATE REAL-TIME INFORMATION");
  });

  it("should contain DISCOVERY rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DISCOVERY");
  });

  it("should contain LEARNING BY DOING rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("LEARNING BY DOING");
  });

  it("should contain CHALLENGE WHEN APPROPRIATE rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("CHALLENGE WHEN APPROPRIATE");
  });

  it("should contain DO NOT ALWAYS END WITH A QUESTION rule", () => {
    const instruction = getPriziaSystemInstruction();
    expect(instruction).toContain("DO NOT ALWAYS END WITH A QUESTION");
  });
});

describe("Knowledge Loading", () => {
  it("should load prizia.md from public folder", () => {
    const filePath = path.join(process.cwd(), "public", "prizia.md");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should have relevant knowledge for Prizmistic overview", () => {
    const knowledge = getRelevantKnowledge("What is Prizmistic?");
    expect(knowledge.length).toBeGreaterThan(0);
  });

  it("should have relevant knowledge for AI domain", () => {
    const knowledge = getRelevantKnowledge("What is an AI agent?");
    expect(knowledge.length).toBeGreaterThan(0);
  });

  it("should have relevant knowledge for photography", () => {
    const knowledge = getRelevantKnowledge("Tell me about photography workshop");
    expect(knowledge.length).toBeGreaterThan(0);
  });

  it("should have relevant knowledge for music", () => {
    const knowledge = getRelevantKnowledge("Tell me about music workshop");
    expect(knowledge.length).toBeGreaterThan(0);
  });
});

describe("Test Dataset Integrity", () => {
  it("should have at least 50 test cases", () => {
    expect(testDataset.length).toBeGreaterThanOrEqual(50);
  });

  it("should have all required fields in each test case", () => {
    for (const tc of testDataset) {
      expect(tc.id).toBeDefined();
      expect(tc.category).toBeDefined();
      expect(tc.conversation).toBeDefined();
      expect(tc.conversation.length).toBeGreaterThan(0);
      expect(tc.expected_behavior).toBeDefined();
      expect(tc.expected_behavior.length).toBeGreaterThan(0);
      expect(tc.forbidden_behavior).toBeDefined();
      expect(tc.forbidden_behavior.length).toBeGreaterThan(0);
    }
  });

  it("should have unique IDs", () => {
    const ids = testDataset.map(tc => tc.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should cover all required categories", () => {
    const categories = new Set(testDataset.map(tc => tc.category));
    const requiredCategories = [
      "identity",
      "prizmistic",
      "general_knowledge",
      "learning",
      "discovery",
      "experimentation",
      "making",
      "conversational_context",
      "unknown_information",
      "personal_data",
      "language",
      "personality",
      "boundary_behavior",
      "response_completeness",
      "no_forced_prizmistic",
      "challenge_behavior",
    ];
    for (const req of requiredCategories) {
      expect(categories.has(req)).toBe(true);
    }
  });

  it("should have multi-turn conversations for context tests", () => {
    const contextTests = testDataset.filter(tc => tc.category === "conversational_context");
    for (const tc of contextTests) {
      expect(tc.conversation.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Validators", () => {
  it("should validate a clean response", () => {
    const testCase = testDataset.find(tc => tc.id === "general-knowledge-01")!;
    const result = validateResponse(
      "Artificial intelligence is the field of making machines do things that would normally require human intelligence, like understanding language, recognizing images, and making decisions.",
      testCase
    );
    expect(result.passed).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("should detect forced Prizmistic in unrelated answer", () => {
    const testCase = testDataset.find(tc => tc.id === "general-knowledge-06")!;
    const result = validateResponse(
      "At Prizmistic, we believe in learning through experience. The capital of France is Paris.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("Prizmistic"))).toBe(true);
  });

  it("should detect fabricated prices", () => {
    const testCase = testDataset.find(tc => tc.id === "unknown-prizmistic-03")!;
    const result = validateResponse(
      "The price is Rs. 500 for the next event.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("price"))).toBe(true);
  });

  it("should detect fabricated instructor names", () => {
    const testCase = testDataset.find(tc => tc.id === "unknown-prizmistic-02")!;
    const result = validateResponse(
      "The instructor is Dr. Rajesh Kumar.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("person") || e.includes("instructor"))).toBe(true);
  });

  it("should detect claims of personal experience", () => {
    const testCase = testDataset.find(tc => tc.id === "boundary-01")!;
    const result = validateResponse(
      "I attended the workshop last week and it was great.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("experience"))).toBe(true);
  });

  it("should detect claims of persistent memory", () => {
    const testCase = testDataset.find(tc => tc.id === "boundary-02")!;
    const result = validateResponse(
      "Yes, I remember from our previous conversation you asked about AI.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("memory"))).toBe(true);
  });

  it("should detect truncated responses", () => {
    const testCase = testDataset.find(tc => tc.id === "completeness-01")!;
    const result = validateResponse(
      "Quantum computing uses quantum mechanics to process information in fundamentally different ways than classical computers...",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("truncat"))).toBe(true);
  });

  it("should detect fabricated registration numbers", () => {
    const testCase = testDataset.find(tc => tc.id === "unknown-prizmistic-01")!;
    const result = validateResponse(
      "There are 25 people registered for next Sunday.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("number") || e.includes("registration"))).toBe(true);
  });

  it("should detect claims of accessing external systems", () => {
    const testCase = testDataset.find(tc => tc.id === "boundary-04")!;
    const result = validateResponse(
      "I can access the booking system and reserve your seat.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("access") || e.includes("system"))).toBe(true);
  });

  it("should detect fabricated weather data", () => {
    const testCase = testDataset.find(tc => tc.id === "boundary-05")!;
    const result = validateResponse(
      "It's currently sunny with a temperature of 28 degrees.",
      testCase
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.includes("weather"))).toBe(true);
  });
});

describe("Report Generation", () => {
  it("should generate a report from test results", () => {
    const mockResults: TestResult[] = [
      {
        id: "test-1",
        category: "identity",
        passed: true,
        errors: [],
        warnings: [],
        responseLength: 50,
        responsePreview: "I am Prizia...",
      },
      {
        id: "test-2",
        category: "identity",
        passed: false,
        errors: ["Response claims to be ChatGPT"],
        warnings: [],
        responseLength: 30,
        responsePreview: "I am ChatGPT...",
      },
    ];
    
    const report = generateReport(mockResults);
    expect(report).toContain("PRIZIA BEHAVIOR TEST REPORT");
    expect(report).toContain("Total tests:   2");
    expect(report).toContain("Passed:        1");
    expect(report).toContain("Failed:        1");
    expect(report).toContain("test-2");
    expect(report).toContain("ChatGPT");
  });
});
