import { Domain, Message, PriziaResponse } from "./types";
import { prizmistic, events } from "@/data/prizmistic";
import { aiTopics } from "@/data/domains/ai";

// FUTURE: Replace this mock response engine with real AI/Supercode integration.
// The getPriziaResponse function signature should remain the same for easy handoff.

export function getPriziaResponse(
  userMessage: string,
  conversationHistory: Message[],
  activeDomains: Domain[]
): PriziaResponse {
  const lower = userMessage.toLowerCase().trim();
  const lastAssistant = [...conversationHistory]
    .reverse()
    .find((m) => m.role === "assistant");

  // --- CHAT: greetings and casual ---
  if (isGreeting(lower)) {
    return {
      mode: "CHAT",
      text: "Hey! I'm Prizia — the conversational intelligence of Prizmistic. What are you curious about?",
      suggestions: ["Explore AI", "What's happening here?", "Tell me about Prizmistic"],
    };
  }

  if (isCasual(lower)) {
    return {
      mode: "CHAT",
      text: "That's kind of you. I'm here to explore what we're learning and creating at Prizmistic. Right now, that's AI.",
      suggestions: ["Explore AI", "What's happening here?"],
    };
  }

  // --- DIRECT: about Prizmistic or events ---
  if (isAboutPrizmistic(lower)) {
    return handlePrizmisticQuestion(lower);
  }

  // --- REDIRECT: clearly outside scope ---
  if (isOutOfScope(lower)) {
    return {
      mode: "REDIRECT",
      text: `That's a little outside what I'm here to explore with you. I'm built specifically for Prizmistic and what we're learning, creating, and organizing here. Right now, that's AI.`,
      suggestions: ["Explore AI", "What's happening here?"],
    };
  }

  // --- UNKNOWN: about Prizmistic but no info ---
  if (isUnknownPrizmistic(lower)) {
    return {
      mode: "UNKNOWN",
      text: "I don't have that information right now. I don't want to guess and tell you something that isn't true. You can ask me about the spaces, activities, and workshops I do have information about.",
      suggestions: ["Tell me about Prizmistic", "Explore AI"],
    };
  }

  // --- TEACH/CONNECT: AI domain questions ---
  const aiResponse = findAIResponse(lower);
  if (aiResponse) {
    return aiResponse;
  }

  // --- Context-aware follow-ups ---
  if (lastAssistant) {
    const contextResponse = handleFollowUp(lower, lastAssistant);
    if (contextResponse) return contextResponse;
  }

  // --- Default: mild redirect ---
  return {
    mode: "CHAT",
    text: "I'm not sure how to help with that. I'm focused on what Prizmistic is exploring — right now, AI. Want to dive into that?",
    suggestions: ["Explore AI", "What's happening here?", "Tell me about Prizmistic"],
  };
}

function isGreeting(msg: string): boolean {
  return /^(hi|hello|hey|yo|sup|hiya|howdy|greetings|good morning|good afternoon|good evening|what's up|whats up)\b/.test(msg);
}

function isCasual(msg: string): boolean {
  return /^(you'?re?\s+(cool|awesome|great|amazing|nice|cute|fun)|thanks|thank you|ok|okay|cool|nice|lol|haha|lol that|that'?s?\s+(cool|funny|interesting))/.test(msg) ||
    msg.length < 6;
}

function isAboutPrizmistic(msg: string): boolean {
  return /prizmistic|what (is|are) (this|here|prizmistic)|tell me about|what'?s?\s+happening|whats happening|what do you|what does prizmistic|who (is|are) you|prizia/.test(msg) &&
    !isOutOfScope(msg) &&
    !isUnknownPrizmistic(msg);
}

function handlePrizmisticQuestion(msg: string): PriziaResponse {
  if (/what'?s?\s+happening|events|workshop|classes|sessions|what'?s?\s+on/.test(msg)) {
    const activeEvent = events.find((e) => e.active);
    return {
      mode: "DIRECT",
      text: activeEvent
        ? `Right now, Prizmistic is running the ${activeEvent.title} — ${activeEvent.description} It's scheduled for ${activeEvent.schedule}.`
        : "I don't have specific event details right now, but Prizmistic is always exploring new things.",
      suggestions: ["Tell me about the workshop", "What is AI?"],
    };
  }

  if (/prizia|who (is|are) you|about you|your purpose/.test(msg)) {
    return {
      mode: "DIRECT",
      text: `I'm Prizia — the conversational intelligence of ${prizmistic.name}. ${prizmistic.description} I know what's happening here and can explore the subjects we're currently learning and creating.`,
      suggestions: ["What are you exploring?", "Tell me about Prizmistic"],
    };
  }

  return {
    mode: "DIRECT",
    text: `${prizmistic.name} is ${prizmistic.description} We're currently focused on exploring AI — learning how to use it, build with it, and understand what it means for creativity and work.`,
    suggestions: ["Explore AI", "What's the AI workshop?"],
  };
}

function isOutOfScope(msg: string): boolean {
  const outOfScope = [
    /capital of|population of|weather|stock|price|recipe|horoscope|sports|score|game|movie|song|music|politic|election|religion|dating|love life|relationship advice|medical|health advice|legal advice|investment|cryptocurrency|bitcoin|travel|flights|hotel|restaurant|recipe|how to cook|weather forecast|lottery|winner|football|soccer|basketball|cricket|tennis|nba|nfl|fifa|olympics|world cup|election|president|prime minister|ceo|elon|trump|biden|musk|openai|google|apple|tesla|meta|amazon|microsoft|chatgpt|gemini|claude|gpt|llama|mistral|anthropic/,
  ];
  return outOfScope.some((re) => re.test(msg));
}

function isUnknownPrizmistic(msg: string): boolean {
  return /photography|gym|pool|sauna|parking|garage|upstairs|downstairs|basement|roof|garden|pet|animal|room\d|floor\s*\d|number of (people|students|members)|capacity|price|cost|membership|fee|staff|teacher|instructor name|owner|founder|who runs|who started/.test(msg) &&
    !/prizia|prizmistic|workshop|ai|art|clay|create|learn|explore|making/.test(msg);
}

function findAIResponse(msg: string): PriziaResponse | null {
  for (const [topic, response] of Object.entries(aiTopics)) {
    if (msg.includes(topic)) {
      return { mode: "TEACH", text: response.text, suggestions: response.suggestions };
    }
  }

  // Partial match
  if (/ai|artificial|machine learn|deep learn|neural|generat|prompt|model|train|algorithm|code|program|python|api|agent|chatbot|llm|nlp/.test(msg)) {
    return {
      mode: "TEACH",
      text: "That's a great question about AI. AI is a broad field — could you be more specific about what you'd like to explore? I can help with topics like AI agents, generative AI, prompting, or how AI is being used at Prizmistic.",
      suggestions: [
        "What is an AI agent?",
        "What is generative AI?",
        "How do I write good prompts?",
        "What's the AI workshop?",
      ],
    };
  }

  return null;
}

function handleFollowUp(msg: string, lastAssistant: Message): PriziaResponse | null {
  const lastText = lastAssistant.content.toLowerCase();

  if (/example|show me|demonstrate/.test(msg) && lastAssistant.suggestions?.includes("Show me an example")) {
    return {
      mode: "TEACH",
      text: `Here's a simple example of an AI agent in action:

You ask: "Find me a restaurant nearby that's open now and has good reviews."

A chatbot would search the web and list results.
An agent would:
1. Check your location
2. Search for nearby restaurants
3. Filter by current opening hours
4. Rank by reviews
5. Book a table if you want

The key difference: an agent takes actions toward completing a goal, not just answering a question.`,
      suggestions: [
        "How are agents different from chatbots?",
        "Can I build one?",
      ],
    };
  }

  if (/different|vs|versus|compared|chatbot/.test(msg) && (lastAssistant.suggestions?.includes("How are agents different from chatbots?") || lastText.includes("agent"))) {
    return {
      mode: "TEACH",
      text: `Here's the key distinction:

Chatbot:
• Reacts to messages
• Has no memory between turns (usually)
• Can't use external tools
• Responds and forgets

AI Agent:
• Plans steps toward a goal
• Remembers context
• Uses tools (APIs, databases, search, code execution)
• Makes decisions about what to do next
• Learns from feedback within a session

Think of it this way: a chatbot is like someone who only answers questions. An agent is like someone who can actually do things for you.`,
      suggestions: [
        "How do I build an agent?",
        "What tools do agents use?",
        "Tell me more about AI",
      ],
    };
  }

  if (/build|create|make|start|code|develop/.test(msg)) {
    return {
      mode: "TEACH",
      text: `You can build an AI agent using a few key components:

1. A language model (like GPT, Claude, or open-source alternatives)
2. A memory system to keep track of context
3. Tool definitions — things the agent can do (search, code, APIs)
4. A reasoning loop that lets the agent plan and execute steps

The simplest agent is just a loop: receive input, think about what to do, take an action, observe the result, repeat.

At Prizmistic, we're exploring exactly this kind of hands-on AI building.`,
      suggestions: [
        "What tools do agents use?",
        "Tell me about the workshop",
      ],
    };
  }

  if (/included|what do|what will|workshop/.test(msg)) {
    return {
      mode: "DIRECT",
      text: "The AI Workshop covers practical AI skills — from understanding what AI actually is, to writing effective prompts, to using AI tools for learning, research, creativity, and work. You'll get hands-on experience, not just theory.",
      suggestions: [
        "Who is it for?",
        "What can I actually do with AI?",
      ],
    };
  }

  if (/who|target|beginner|advanced|for whom|newbie/.test(msg)) {
    return {
      mode: "DIRECT",
      text: "The workshop is designed for anyone curious about AI — whether you're a complete beginner or someone who's been using AI tools and wants to go deeper. The focus is on practical skills you can actually use.",
      suggestions: [
        "What can I actually do with AI?",
        "Tell me more about the workshop",
      ],
    };
  }

  if (/do with|practical|real|actual|use ai/.test(msg)) {
    return {
      mode: "TEACH",
      text: `Here are practical ways you can use AI today:

Learning:
• Explain complex topics in simple terms
• Generate study questions and summaries
• Translate languages instantly

Creativity:
• Generate ideas andbrainstorm
• Create images from descriptions
• Write and edit text
• Generate code and scripts

Research:
• Summarize long documents
• Find patterns in data
• Explore topics from multiple angles

Work:
• Automate repetitive tasks
• Draft emails and documents
• Analyze information faster
• Build simple tools without coding expertise`,
      suggestions: [
        "Tell me about the workshop",
        "What is an AI agent?",
      ],
    };
  }

  return null;
}
