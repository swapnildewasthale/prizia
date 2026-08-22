import { kv } from "@vercel/kv";
import { StudioData } from "./types";
import { defaultConfig } from "./defaults";

const STORAGE_KEY = "prizia:studio";

const emptyData: StudioData = {
  draft: { ...defaultConfig },
  published: { ...defaultConfig },
};

export async function getStudioData(): Promise<StudioData> {
  try {
    const data = await kv.get<StudioData>(STORAGE_KEY);
    if (!data) return emptyData;
    return {
      draft: { ...defaultConfig, ...data.draft },
      published: { ...defaultConfig, ...data.published },
    };
  } catch {
    console.warn("[Studio] KV not available, using defaults");
    return emptyData;
  }
}

export async function saveDraft(draft: StudioData["draft"]): Promise<void> {
  const existing = await getStudioData();
  await kv.set(STORAGE_KEY, { ...existing, draft });
}

export async function publishDraft(): Promise<void> {
  const existing = await getStudioData();
  await kv.set(STORAGE_KEY, {
    draft: existing.draft,
    published: { ...existing.draft },
  });
}

export async function getPublishedConfig(): Promise<StudioData["published"]> {
  const data = await getStudioData();
  return data.published;
}

export async function getDraftConfig(): Promise<StudioData["draft"]> {
  const data = await getStudioData();
  return data.draft;
}
