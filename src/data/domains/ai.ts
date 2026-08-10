// AI domain knowledge for Prizia.
// FUTURE: Replace with vector store / retrieval system for real AI knowledge.

export const aiTopics: Record<string, { text: string; suggestions?: string[] }> = {
  "ai agent": {
    text: `An AI agent is an AI system that can do more than simply respond to a question. It can work toward a goal, decide what steps are needed, use tools or information, and carry those steps out.

A simple way to think about it:

A chatbot mainly talks. An agent can act toward a goal.

Agents can remember context, use external tools, break tasks into sub-tasks, and make decisions about what to do next.`,
    suggestions: [
      "Show me an example",
      "How are agents different from chatbots?",
      "Can I build one?",
    ],
  },
  "what is ai": {
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
  },
  "generative ai": {
    text: `Generative AI refers to AI systems that can create new content — text, images, code, music, video, and more.

Unlike traditional AI that mainly classifies or analyzes, generative AI produces something new based on patterns it learned during training.

Some well-known examples:
• Language models (like me) that generate text
• Image generators that create pictures from descriptions
• Code assistants that write and explain code

At Prizmistic, we're exploring how to use generative AI as a creative and learning tool.`,
    suggestions: [
      "How do I write good prompts?",
      "What can I create with AI?",
      "Tell me about the workshop",
    ],
  },
  prompt: {
    text: `A prompt is the instruction or input you give to an AI system. The quality of your prompt significantly affects the quality of the response.

Good prompting is about:
• Being clear about what you want
• Providing relevant context
• Specifying the format or style you need
• Iterating and refining based on results

It's less about magic words and more about clear communication with a system that processes language in a very literal way.`,
    suggestions: [
      "Show me a prompt example",
      "What makes a bad prompt?",
      "How do I get better results?",
    ],
  },
  "ai workshop": {
    text: `The AI Workshop at Prizmistic is a practical introduction to AI, generative AI, prompting, AI tools, and ways to use AI for learning, research, creativity, and work.

It's happening Saturday at 4 PM.

The focus is hands-on — you'll learn by doing, not just listening. Whether you're completely new to AI or want to deepen your understanding, the workshop meets you where you are.`,
    suggestions: [
      "What's included?",
      "What can I actually do with AI?",
      "Who is it for?",
    ],
  },
  "chatbot": {
    text: `A chatbot is a program designed to simulate conversation. It responds to text inputs and tries to provide relevant answers.

The key difference between a chatbot and an AI agent:

A chatbot is reactive — you ask, it answers, and it forgets.
An agent is proactive — it can plan, use tools, remember context, and work toward goals.

Most AI assistants today are somewhere on the spectrum between simple chatbots and full agents.`,
    suggestions: [
      "What makes an agent different?",
      "How does Prizia work?",
      "Tell me about AI agents",
    ],
  },
  "prizia": {
    text: `I'm Prizia — the conversational intelligence of Prizmistic.

I know what's happening at Prizmistic and can explore the subjects we're currently learning, teaching, and creating.

Right now, that means AI.

I'm not a general-purpose assistant. I'm here specifically for Prizmistic and what we're exploring together.`,
    suggestions: [
      "What is Prizmistic?",
      "What are you exploring now?",
      "Tell me about AI",
    ],
  },
};
