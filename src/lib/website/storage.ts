import { kv } from "@vercel/kv";
import { WebsiteConfig, WebsiteData } from "./types";
import { defaultWebsiteConfig } from "./defaults";

const STORAGE_KEY = "prizia:website";

const emptyData: WebsiteData = {
  draft: defaultWebsiteConfig,
  published: defaultWebsiteConfig,
};

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function normalizeNavLinks(
  stored: unknown,
  fallback: WebsiteConfig["nav"],
): WebsiteConfig["nav"] {
  if (!Array.isArray(stored)) return fallback;
  return stored.map((item, i) => ({
    label: typeof item?.label === "string" ? item.label : fallback[i]?.label ?? "",
    href: typeof item?.href === "string" ? item.href : fallback[i]?.href ?? "",
  }));
}

function normalizeFooter(
  stored: unknown,
  fallback: WebsiteConfig["footer"],
): WebsiteConfig["footer"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    tagline: typeof s.tagline === "string" ? s.tagline : fallback.tagline,
    copyright: typeof s.copyright === "string" ? s.copyright : fallback.copyright,
    links: Array.isArray(s.links)
      ? s.links.map((item: Record<string, unknown>, i: number) => ({
          label: typeof item?.label === "string" ? item.label : fallback.links[i]?.label ?? "",
          href: typeof item?.href === "string" ? item.href : fallback.links[i]?.href ?? "",
        }))
      : fallback.links,
  };
}

function normalizeHomepage(
  stored: unknown,
  fallback: WebsiteConfig["homepage"],
): WebsiteConfig["homepage"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;

  return {
    hero: normalizeHero(s.hero, fallback.hero),
    priziaEntry: normalizePriziaEntry(s.priziaEntry, fallback.priziaEntry),
    whatIs: normalizeWhatIs(s.whatIs, fallback.whatIs),
    values: normalizeValues(s.values, fallback.values),
    currentlyExploring: normalizeCurrentlyExploring(
      s.currentlyExploring,
      fallback.currentlyExploring,
    ),
    galleryPreview: normalizeGalleryPreview(s.galleryPreview, fallback.galleryPreview),
    priziaInvitation: normalizePriziaInvitation(
      s.priziaInvitation,
      fallback.priziaInvitation,
    ),
  };
}

function normalizeHero(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["hero"],
): WebsiteConfig["homepage"]["hero"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    headline: typeof s.headline === "string" ? s.headline : fallback.headline,
    sub: typeof s.sub === "string" ? s.sub : fallback.sub,
  };
}

function normalizePriziaEntry(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["priziaEntry"],
): WebsiteConfig["homepage"]["priziaEntry"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    label: typeof s.label === "string" ? s.label : fallback.label,
    placeholder: typeof s.placeholder === "string" ? s.placeholder : fallback.placeholder,
  };
}

function normalizeWhatIs(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["whatIs"],
): WebsiteConfig["homepage"]["whatIs"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    heading: typeof s.heading === "string" ? s.heading : fallback.heading,
    paragraphs: Array.isArray(s.paragraphs)
      ? s.paragraphs.map(
          (p: unknown, i: number) =>
            typeof p === "string" ? p : fallback.paragraphs[i] ?? "",
        )
      : fallback.paragraphs,
  };
}

function normalizeValues(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["values"],
): WebsiteConfig["homepage"]["values"] {
  if (!Array.isArray(stored)) return fallback;
  return stored.map((item: Record<string, unknown>, i: number) => {
    const fb = fallback[i];
    return {
      title: typeof item?.title === "string" ? item.title : fb?.title ?? "",
      description:
        typeof item?.description === "string"
          ? item.description
          : fb?.description ?? "",
      icon: typeof item?.icon === "string" ? item.icon : fb?.icon ?? "",
    };
  });
}

function normalizeCurrentlyExploring(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["currentlyExploring"],
): WebsiteConfig["homepage"]["currentlyExploring"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    heading: typeof s.heading === "string" ? s.heading : fallback.heading,
    domains: Array.isArray(s.domains)
      ? s.domains.map((item: Record<string, unknown>, i: number) => {
          const fb = fallback.domains[i];
          return {
            id: typeof item?.id === "string" ? item.id : fb?.id ?? "",
            name: typeof item?.name === "string" ? item.name : fb?.name ?? "",
            description:
              typeof item?.description === "string"
                ? item.description
                : fb?.description ?? "",
            href: typeof item?.href === "string" ? item.href : fb?.href ?? "",
          };
        })
      : fallback.domains,
  };
}

function normalizeGalleryPreview(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["galleryPreview"],
): WebsiteConfig["homepage"]["galleryPreview"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    heading: typeof s.heading === "string" ? s.heading : fallback.heading,
    description:
      typeof s.description === "string" ? s.description : fallback.description,
    href: typeof s.href === "string" ? s.href : fallback.href,
  };
}

function normalizePriziaInvitation(
  stored: unknown,
  fallback: WebsiteConfig["homepage"]["priziaInvitation"],
): WebsiteConfig["homepage"]["priziaInvitation"] {
  if (!stored || typeof stored !== "object") return fallback;
  const s = stored as Record<string, unknown>;
  return {
    heading: typeof s.heading === "string" ? s.heading : fallback.heading,
    sub: typeof s.sub === "string" ? s.sub : fallback.sub,
  };
}

function normalizeWebsiteConfig(
  stored: Partial<WebsiteConfig> | undefined | null,
): WebsiteConfig {
  if (!stored || typeof stored !== "object") return defaultWebsiteConfig;

  return {
    site: {
      name:
        typeof stored.site?.name === "string"
          ? stored.site.name
          : defaultWebsiteConfig.site.name,
      tagline:
        typeof stored.site?.tagline === "string"
          ? stored.site.tagline
          : defaultWebsiteConfig.site.tagline,
      description:
        typeof stored.site?.description === "string"
          ? stored.site.description
          : defaultWebsiteConfig.site.description,
    },
    nav: normalizeNavLinks(stored.nav, defaultWebsiteConfig.nav),
    footer: normalizeFooter(stored.footer, defaultWebsiteConfig.footer),
    homepage: normalizeHomepage(stored.homepage, defaultWebsiteConfig.homepage),
  };
}

export async function getWebsiteData(): Promise<WebsiteData> {
  if (!isKvConfigured()) {
    console.warn(
      "[Website] KV env vars not set (KV_REST_API_URL, KV_REST_API_TOKEN). Using defaults.",
    );
    return emptyData;
  }
  try {
    const data = await kv.get<WebsiteData>(STORAGE_KEY);
    if (!data) return emptyData;
    return {
      draft: normalizeWebsiteConfig(data.draft),
      published: normalizeWebsiteConfig(data.published),
    };
  } catch (err) {
    console.warn("[Website] KV read failed:", err);
    return emptyData;
  }
}

export async function saveWebsiteDraft(
  draft: WebsiteConfig,
): Promise<void> {
  if (!isKvConfigured()) {
    throw new Error(
      "Storage not configured: KV_REST_API_URL and KV_REST_API_TOKEN environment variables are not set. Go to Vercel Dashboard > Settings > KV to set them.",
    );
  }
  try {
    const existing = await getWebsiteData();
    await kv.set(STORAGE_KEY, { ...existing, draft });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Website] KV save failed:", msg);
    throw new Error(`Failed to save to database: ${msg}`);
  }
}

export async function publishWebsiteDraft(): Promise<void> {
  if (!isKvConfigured()) {
    throw new Error(
      "Storage not configured: KV_REST_API_URL and KV_REST_API_TOKEN environment variables are not set. Go to Vercel Dashboard > Settings > KV to set them.",
    );
  }
  try {
    const existing = await getWebsiteData();
    await kv.set(STORAGE_KEY, {
      draft: existing.draft,
      published: { ...existing.draft },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Website] KV publish failed:", msg);
    throw new Error(`Failed to publish to database: ${msg}`);
  }
}

export async function getPublishedWebsiteConfig(): Promise<WebsiteConfig> {
  const data = await getWebsiteData();
  return data.published;
}

export async function getWebsiteDraft(): Promise<WebsiteConfig> {
  const data = await getWebsiteData();
  return data.draft;
}
