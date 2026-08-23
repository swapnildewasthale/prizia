import { Alignment } from "./types";

export type EditableProperty =
  | "content"
  | "alignment"
  | "textColor"
  | "bgColor"
  | "link"
  | "visible";

export interface EditableElementConfig {
  supports: EditableProperty[];
}

export const COLOR_PRESETS = {
  text: [
    { label: "Default", value: null },
    { label: "White", value: "#FFF2DB" },
    { label: "Amber", value: "#F5A623" },
    { label: "Cyan", value: "#4DD9D0" },
    { label: "Violet", value: "#8B6CFF" },
    { label: "Muted", value: "rgba(255,242,219,0.5)" },
  ],
  buttonBg: [
    { label: "Default", value: null },
    { label: "Amber", value: "#F5A623" },
    { label: "Cyan", value: "#4DD9D0" },
    { label: "Violet", value: "#8B6CFF" },
    { label: "White", value: "#FFF2DB" },
    { label: "Dark", value: "#111111" },
  ],
  buttonText: [
    { label: "Default", value: null },
    { label: "Dark", value: "#000000" },
    { label: "White", value: "#FFF2DB" },
  ],
} as const;

export const ALIGNMENT_OPTIONS: { label: string; value: Alignment }[] = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];
