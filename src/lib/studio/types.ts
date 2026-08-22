export interface PriziaIdentity {
  name: string;
  role: string;
  purpose: string;
}

export interface PriziaBehavior {
  answerDirectness: string;
  challengeAssumptions: string;
  askQuestions: string;
  handleUncertainty: string;
  connectToPrizmistic: string;
  customInstructions: string;
}

export interface PriziaCommunication {
  languageBehavior: string;
  hinglishHandling: string;
  tone: string;
  responseStyle: string;
  responseLength: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  active: boolean;
}

export interface PriziaConfig {
  identity: PriziaIdentity;
  behavior: PriziaBehavior;
  communication: PriziaCommunication;
  knowledge: KnowledgeEntry[];
}

export interface StudioData {
  draft: PriziaConfig;
  published: PriziaConfig;
}
