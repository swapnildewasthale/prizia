"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/studio/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/?edit=true");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-audiowide)] text-2xl text-[#FFF2DB]">
            PRIZMISTIC STUDIO
          </h1>
          <p className="mt-2 text-sm text-[#FFF2DB]/40">
            Private dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-[#FFF2DB]/50 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#FFF2DB]/10 bg-[#0a0a0a] px-4 py-3 text-[#FFF2DB] placeholder:text-[#FFF2DB]/20 focus:outline-none focus:border-[#F5A623]/40"
              placeholder="Enter studio password"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full rounded-xl bg-[#F5A623] px-4 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#F5A623]/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Enter Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}
