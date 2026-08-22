import { kv } from "@vercel/kv";
import { StudioData } from "./types";
import { defaultConfig } from "./defaults";

const STORAGE_KEY = "prizia:studio";

const emptyData: StudioData = {
  draft: { ...defaultConfig },
  published: { ...defaultConfig },
};

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getStudioData(): Promise<StudioData> {
  if (!isKvConfigured()) {
    console.warn("[Studio] KV env vars not set (KV_REST_API_URL, KV_REST_API_TOKEN). Using defaults.");
    return emptyData;
  }
  try {
    const data = await kv.get<StudioData>(STORAGE_KEY);
    if (!data) return emptyData;
    return {
      draft: { ...defaultConfig, ...data.draft },
      published: { ...defaultConfig, ...data.published },
    };
  } catch (err) {
    console.warn("[Studio] KV read failed:", err);
    return emptyData;
  }
}

export async function saveDraft(draft: StudioData["draft"]): Promise<void> {
  if (!isKvConfigured()) {
    throw new Error("Storage not configured: KV_REST_API_URL and KV_REST_API_TOKEN environment variables are not set. Go to Vercel Dashboard > Settings > KV to set them.");
  }
  try {
    const existing = await getStudioData();
    await kv.set(STORAGE_KEY, { ...existing, draft });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Studio] KV save failed:", msg);
    throw new Error(`Failed to save to database: ${msg}`);
  }
}

export async function publishDraft(): Promise<void> {
  if (!isKvConfigured()) {
    throw new Error("Storage not configured: KV_REST_API_URL and KV_REST_API_TOKEN environment variables are not set. Go to Vercel Dashboard > Settings > KV to set them.");
  }
  try {
    const existing = await getStudioData();
    await kv.set(STORAGE_KEY, {
      draft: existing.draft,
      published: { ...existing.draft },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Studio] KV publish failed:", msg);
    throw new Error(`Failed to publish to database: ${msg}`);
  }
}

export async function getPublishedConfig(): Promise<StudioData["published"]> {
  const data = await getStudioData();
  return data.published;
}

export async function getDraftConfig(): Promise<StudioData["draft"]> {
  const data = await getStudioData();
  return data.draft;
}
