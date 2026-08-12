import Link from "next/link";
import NavBar from "@/components/prizia/NavBar";
import Footer from "@/components/prizia/Footer";

export const metadata = {
  title: "About — Prizmistic",
  description: "About Prizmistic.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#101015] font-[family-name:var(--font-comfortaa)] text-[#fff5e3]">
      <NavBar />
      <main className="flex min-h-[calc(100vh-112px)] items-center justify-center px-5 pb-24 pt-28 sm:px-10">
        <section className="flex max-w-2xl flex-col items-center text-center">
          <h1 className="font-[family-name:var(--font-audiowide)] text-3xl font-normal tracking-[-0.055em] text-[#fff2dc] sm:text-5xl">
            About
          </h1>
          <p className="mt-6 text-lg text-[#a49ba0]">
            Ye page abhi ban raha hai.
          </p>
          <Link
            href="/"
            className="mt-8 text-sm text-[#d5842d] transition hover:text-[#ffad0d]"
          >
            ← Wapas jao
          </Link>
        </section>
      </main>
    </div>
  );
}
