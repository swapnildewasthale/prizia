import { getPublishedWebsiteConfig } from "@/lib/website/storage";
import HomepageContent from "@/components/prizia/HomepageContent";
import { EditorProvider } from "@/components/prizia/EditorContext";
import EditorToggle from "@/components/prizia/EditorToggle";
import EditorPanel from "@/components/prizia/EditorPanel";

export default async function Home() {
  const config = await getPublishedWebsiteConfig();
  return (
    <EditorProvider>
      <HomepageContent config={config} />
      <EditorToggle />
      <EditorPanel />
    </EditorProvider>
  );
}
