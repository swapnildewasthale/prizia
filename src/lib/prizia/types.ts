export type MessageRole = "user" | "assistant";

export type ResponseMode =
  | "DIRECT"
  | "TEACH"
  | "CONNECT"
  | "REDIRECT"
  | "UNKNOWN"
  | "CHAT";

export type PriziaState = "idle" | "listening" | "thinking" | "responding";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  mode?: ResponseMode;
  suggestions?: string[];
};

export type Domain = {
  id: string;
  name: string;
  active: boolean;
};

export type PriziaResponse = {
  mode: ResponseMode;
  text: string;
  suggestions?: string[];
};
