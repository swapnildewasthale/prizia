import Link from "next/link";
import NavBar from "@/components/prizia/NavBar";
import { getPublishedWebsiteConfig } from "@/lib/website/storage";

export const metadata = {
  title: "Gallery — Prizmistic",
  description: "Things we've made, explored and experienced at Prizmistic.",
};

export default async function GalleryPage() {
  const config = await getPublishedWebsiteConfig();

  return (
    <div className="min-h-screen bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB]">
      <NavBar nav={config.nav} />
      <main className="flex min-h-[calc(100vh-112px)] items-center justify-center px-5 pb-24 pt-28 sm:px-10">
        <section className="flex max-w-2xl flex-col items-center text-center">
          <h1 className="font-[family-name:var(--font-audiowide)] text-3xl font-normal tracking-[-0.055em] text-[#FFF2DB] sm:text-5xl">
            Gallery
          </h1>
          <p className="mt-6 text-lg text-[#FFF2DB]/50">
            Ye page abhi ban raha hai.
          </p>
          <Link
            href="/"
            className="mt-8 text-sm text-[#F5A623] transition hover:text-[#F5A623]"
          >
            ← Wapas jao
          </Link>
        </section>
      </main>
    </div>
  );
}
