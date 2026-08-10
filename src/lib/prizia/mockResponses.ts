import { Domain, Message, PriziaResponse } from "./types";
import { prizmistic, events } from "@/data/prizmistic";
import { searchKnowledge, getActiveDomains, isActiveDomain } from "./knowledge";

// FUTURE: Replace mock engine with real AI/Supercode integration.
// When connecting a real AI, feed src/data/prizia.md as system context.
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
      text: "Hey! I'm Prizia — the conversational intelligence of Prizmistic. I know what's happening here and can explore the subjects we're learning and creating. What are you curious about?",
      suggestions: ["Explore AI", "What's happening here?", "Tell me about Prizmistic"],
    };
  }

  if (isCasual(lower)) {
    const domains = getActiveDomains();
    const domainList = domains.join(", ");
    return {
      mode: "CHAT",
      text: `That's kind of you. I'm here to explore what we're learning and creating at Prizmistic — a place for learning, making, experimenting, and bringing ideas together. Right now, we're exploring ${domainList}.`,
      suggestions: domains.map((d) => `${d} Workshop`).slice(0, 3),
    };
  }

  if (/who (is|are) you|are you (a )?real|what are you|tell me about yourself|your purpose/.test(lower)) {
    return {
      mode: "CHAT",
      text: "Nope, I'm not a real person. I'm Prizia — an AI built to be the conversational intelligence of Prizmistic. My job is to know what's happening here and help you explore the subjects we're learning, creating, and experimenting with.",
      suggestions: ["What is Prizmistic?", "What are you exploring?"],
    };
  }

  // --- DIRECT: about Prizmistic or events ---
  if (isAboutPrizmistic(lower)) {
    return handlePrizmisticQuestion(lower);
  }

  // --- TEACH/CONNECT: Knowledge-based responses from prizia.md ---
  const knowledgeResponse = findKnowledgeResponse(lower);
  if (knowledgeResponse) {
    return knowledgeResponse;
  }

  // --- Context-aware follow-ups ---
  if (lastAssistant) {
    const contextResponse = handleFollowUp(lower, lastAssistant);
    if (contextResponse) return contextResponse;
  }

  // --- Default: mild redirect ---
  const defaultDomains = getActiveDomains();
  const defaultDomainList = defaultDomains.join(", ");
  return {
    mode: "CHAT",
    text: `I'm not sure how to help with that right now. I'm focused on what Prizmistic is exploring — ${defaultDomainList}. Want to dive into any of those?`,
    suggestions: defaultDomains.map((d) => `${d} Workshop`).slice(0, 3),
  };
}

function isGreeting(msg: string): boolean {
  return /^(hi|hello|hey|yo|sup|hiya|howdy|greetings|good morning|good afternoon|good evening|what'?s?\s*up|whats\s*up)\b/.test(msg);
}

function isCasual(msg: string): boolean {
  return /^(you'?re?\s+(cool|awesome|great|amazing|nice|cute|fun|smart)|thanks|thank you|ok|okay|cool|nice|lol|haha|lol that|that'?s?\s+(cool|funny|interesting)|i like you|you'?re?\s+the best)/.test(msg) ||
    msg.length < 6;
}

function isAboutPrizmistic(msg: string): boolean {
  // Check if the message is about any active domain
  const activeDomains = getActiveDomains();
  for (const domain of activeDomains) {
    if (msg.toLowerCase().includes(domain.toLowerCase())) {
      return false; // Let the knowledge handler deal with domain-specific queries
    }
  }

  return /prizmistic|what (is|are) (this|here|prizmistic)|tell me about|what'?s?\s+happening|whats happening|what do you|what does prizmistic|who started|who runs|what kind of (place|space|community)|is this (a|an) (school|college|class|cowork|center)/.test(msg) &&
    !isOutOfScope(msg) &&
    !isUnknownPrizmistic(msg);
}

function handlePrizmisticQuestion(msg: string): PriziaResponse {
  const activeDomains = getActiveDomains();
  const domainList = activeDomains.join(", ");

  if (/what'?s?\s+happening|events|workshop|classes|sessions|what'?s?\s+on|current|now|right now|today/.test(msg)) {
    const activeEvents = events.filter((e) => e.active);
    const eventList = activeEvents.map((e) => e.title).join(", ");
    return {
      mode: "DIRECT",
      text: activeEvents.length > 0
        ? `Right now, Prizmistic is running ${eventList}. We're exploring ${domainList} as practical tools for learning, creativity, and expression.`
        : `I don't have specific event details right now, but Prizmistic is always exploring new things. Currently, we're focused on ${domainList}.`,
      suggestions: activeDomains.map((d) => `${d} Workshop`).slice(0, 3),
    };
  }

  if (/prizia|who (is|are) you|about you|your purpose|why (were|are) you (made|built|created)/.test(msg)) {
    return {
      mode: "DIRECT",
      text: `I'm Prizia — the conversational intelligence of Prizmistic. ${prizmistic.description} I know what's happening here and can explore the subjects we're currently learning, teaching, and creating. My capability can be broad, but my purpose is narrow — I'm here specifically for Prizmistic.`,
      suggestions: ["What are you exploring?", "Tell me more about Prizmistic"],
    };
  }

  if (/what (kind|type) of (place|space|community)|what is prizmistic|describe|explain|about prizmistic/.test(msg)) {
    return {
      mode: "DIRECT",
      text: `${prizmistic.name} is ${prizmistic.description} It's not just a classroom, coworking space, or event venue — it's an environment where people can come with curiosity and find opportunities to learn something, make something, experiment with ideas, attend workshops, and meet interesting people. We're currently exploring ${domainList}.`,
      suggestions: ["What's happening now?", ...activeDomains.map((d) => `${d} Workshop`).slice(0, 2)],
    };
  }

  if (/who started|who runs|founder|owner|who (is )?behind/.test(msg)) {
    return {
      mode: "UNKNOWN",
      text: "I don't have specific information about that right now. What I can tell you is what Prizmistic is and what we're exploring. Want to know more?",
      suggestions: ["What is Prizmistic?", "What are you exploring?"],
    };
  }

  return {
    mode: "DIRECT",
    text: `${prizmistic.name} is ${prizmistic.description} We're currently exploring ${domainList} — learning, creating, and experimenting with these subjects in practical ways.`,
    suggestions: activeDomains.map((d) => `${d} Workshop`).slice(0, 3),
  };
}

function isOutOfScope(msg: string): boolean {
  // Check if the message is about any active domain
  const activeDomains = getActiveDomains();
  for (const domain of activeDomains) {
    if (msg.toLowerCase().includes(domain.toLowerCase())) {
      return false; // Don't block domain-specific queries
    }
  }

  const outOfScope = [
    /capital of|population of|weather (in|today|tomorrow)|stock (price|market)|share price|recipe|horoscope|sports (score|result|match)|game result|movie (review|rating|release)|politic|election|religion|dating advice|love life|relationship advice|medical (advice|diagnosis)|health advice|legal advice|investment advice|cryptocurrency|bitcoin price|travel (booking|flights|hotel|deal)|restaurant (near|recommend)|recipe for|weather forecast|lottery (result|winner|number)|football (match|result|score)|soccer|basketball|cricket (match|score)|tennis|nba|nfl|fifa|world cup|olympics|president|prime minister|ceo of|elon musk|trump|biden|openai (stock|valuation)|google (stock|finance)|apple (stock|finance)|tesla (stock)|meta (stock)|amazon (stock)|microsoft (stock)/
  ];
  return outOfScope.some((re) => re.test(msg));
}

function isUnknownPrizmistic(msg: string): boolean {
  // Check if the message is about any active domain
  const activeDomains = getActiveDomains();
  for (const domain of activeDomains) {
    if (msg.toLowerCase().includes(domain.toLowerCase())) {
      return false; // Don't block domain-specific queries
    }
  }

  return /photography (studio|equipment)|gym|pool|sauna|parking|garage|upstairs|downstairs|basement|roof|garden|pet friendly|animal|room\s*\d|floor\s*\d|number of (people|students|members)|capacity|price|cost|membership|fee|staff|teacher name|instructor name|owner name|founder name|who runs|who started|address|location|where (are|is) you|how (far|do i get|to get)/.test(msg) &&
    !/prizia|prizmistic|workshop|ai|art|clay|create|learn|explore|making/.test(msg);
}

function findKnowledgeResponse(msg: string): PriziaResponse | null {
  // Search the knowledge base for relevant sections
  const relevantSections = searchKnowledge(msg);

  if (relevantSections.length === 0) {
    return null;
  }

  // Get the most relevant section
  const topSection = relevantSections[0];

  // Clean up the content - remove markdown formatting
  let content = topSection.content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/-{3,}/g, "")
    .trim();

  // Truncate if too long
  if (content.length > 800) {
    content = content.substring(0, 800) + "...";
  }

  // Generate suggestions based on active domains
  const activeDomains = getActiveDomains();
  const suggestions = activeDomains.map((d) => `${d} Workshop`).slice(0, 3);

  return {
    mode: "TEACH",
    text: content,
    suggestions,
  };
}

function handleFollowUp(msg: string, lastAssistant: Message): PriziaResponse | null {
  const lastText = lastAssistant.content.toLowerCase();

  // Context: after explaining AI agents
  if (/example|show me|demonstrate|how does.*work in practice|give me.*example/.test(msg) && lastText.includes("agent")) {
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

The key difference: an agent takes actions toward completing a goal, not just answering a question.

At Prizmistic, we're exploring how to build and use these kinds of systems.`,
      suggestions: [
        "How are agents different from chatbots?",
        "Can I build one?",
      ],
    };
  }

  if (/different|vs|versus|compared|chatbot/.test(msg) && lastText.includes("agent")) {
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

Think of it this way: a chatbot is like someone who only answers questions. An agent is like someone who can actually do things for you.

We explore this distinction in the AI workshop.`,
      suggestions: [
        "How do I build an agent?",
        "Tell me about the workshop",
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

  if (/included|what do|what will|workshop content|curriculum/.test(msg)) {
    return {
      mode: "DIRECT",
      text: "The AI Workshop covers practical AI skills — from understanding what AI actually is, to writing effective prompts, to using AI tools for learning, research, creativity, and work. You'll get hands-on experience, not just theory. We explore AI fundamentals, generative AI, prompting, AI tools, and practical applications.",
      suggestions: [
        "Who is it for?",
        "What can I actually do with AI?",
      ],
    };
  }

  if (/who|target|beginner|advanced|for whom|newbie|level|experience needed/.test(msg)) {
    return {
      mode: "DIRECT",
      text: "The workshop is designed for anyone curious about AI — whether you're a complete beginner or someone who's been using AI tools and wants to go deeper. The focus is on practical skills you can actually use. No prior technical experience needed.",
      suggestions: [
        "What can I actually do with AI?",
        "Tell me more about the workshop",
      ],
    };
  }

  if (/do with|practical|real|actual|use ai|what can i/.test(msg)) {
    return {
      mode: "TEACH",
      text: `Here are practical ways you can use AI today:

Learning:
• Explain complex topics in simple terms
• Generate study questions and summaries
• Translate languages instantly

Creativity:
• Brainstorm ideas
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
• Build simple tools without coding expertise

At Prizmistic, we explore all of these in practice.`,
      suggestions: [
        "Tell me about the workshop",
        "What is an AI agent?",
      ],
    };
  }

  if (/what (is|are) (ai|artificial intelligence)|explain ai|tell me about ai|basics of ai|ai basics|ai fundamentals/.test(msg)) {
    return {
      mode: "TEACH",
      text: `Artificial Intelligence is the broad field of making machines do things that would normally require human intelligence — understanding language, recognizing images, making decisions, generating content.

Within AI, there are many subfields:

• Machine Learning — systems that learn from data
• Deep Learning — neural networks with many layers
• Generative AI — systems that create text, images, code, and more
• Natural Language Processing — understanding and generating human language

Prizmistic is currently exploring AI in a practical, hands-on way — not just theory, but how to actually use these tools.`,
      suggestions: [
        "What is generative AI?",
        "What's the AI workshop about?",
        "How can I use AI?",
      ],
    };
  }

  if (/what (is|are) (you|prizia) (exploring|learning|teaching|doing)|current(ly)? (exploring|focus|subject)/.test(msg)) {
    return {
      mode: "DIRECT",
      text: "Currently, Prizmistic is exploring Artificial Intelligence — understanding it, using it, building with it, and figuring out how it can help with learning, creativity, and work. We're starting with AI but the plan is to explore other subjects too — like clay, photography, design, and more.",
      suggestions: ["Tell me about AI", "What's the workshop?"],
    };
  }

  return null;
}
