import { getPublishedWebsiteConfig } from "@/lib/website/storage";
import HomepageContent from "@/components/prizia/HomepageContent";

export default async function Home() {
  const config = await getPublishedWebsiteConfig();
  return <HomepageContent config={config} />;
}
