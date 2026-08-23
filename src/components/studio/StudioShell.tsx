"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  WebsiteEditorProvider,
  useWebsiteEditor,
} from "./WebsiteEditorContext";
import { ShellHeader } from "./ShellHeader";
import { ShellSidebar } from "./ShellSidebar";
import WebsiteEditorPanel from "./WebsiteEditorPanel";

const WEBSITE_ROUTES = ["/", "/about", "/explore", "/gallery"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { authenticated, activeField, setActiveField } = useWebsiteEditor();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isWebsiteRoute = WEBSITE_ROUTES.includes(pathname);
  const isStudioRoute = pathname.startsWith("/studio");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isStudioRoute) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return <>{children}</>;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-audiowide)] text-xl text-[#FFF2DB] mb-4">
            Website Editing Requires Desktop
          </h1>
          <p className="text-sm text-[#FFF2DB]/50">
            Please use a desktop browser to edit website content.
          </p>
        </div>
      </div>
    );
  }

  const sidebarContent =
    isWebsiteRoute && activeField ? (
      <WebsiteEditorPanel onBack={() => setActiveField(null)} />
    ) : (
      <ShellSidebar
        onNavigate={() => setDrawerOpen(false)}
      />
    );

  return (
    <div className="h-screen flex flex-col bg-[#000000] font-[family-name:var(--font-comfortaa)] text-[#FFF2DB] overflow-hidden">
      <ShellHeader onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:block w-60 shrink-0 border-r border-[#FFF2DB]/5 bg-[#000000] overflow-y-auto">
          {sidebarContent}
        </aside>

        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-[#FFF2DB]/5 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#FFF2DB]/5">
                <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/60">
                  PRIZMISTIC STUDIO
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 -mr-2 text-[#FFF2DB]/40 hover:text-[#FFF2DB]/70 transition"
                  aria-label="Close menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sidebarContent}
              </div>
            </div>
          </>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function StudioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <WebsiteEditorProvider>
      <ShellInner>{children}</ShellInner>
    </WebsiteEditorProvider>
  );
}
