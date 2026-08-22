"use client";

import { useStudio, StudioSection } from "./StudioContext";

interface NavItem {
  id: StudioSection;
  label: string;
}

interface NavCategory {
  label: string;
  items: NavItem[];
  disabled?: boolean;
}

const navigation: NavCategory[] = [
  {
    label: "OVERVIEW",
    items: [{ id: "prizia-overview", label: "Overview" }],
  },
  {
    label: "PRIZIA",
    items: [
      { id: "prizia-foundation", label: "Foundation" },
      { id: "prizia-behavior", label: "Behavior" },
      { id: "prizia-communication", label: "Communication" },
      { id: "prizia-knowledge", label: "Knowledge" },
      { id: "prizia-test", label: "Test" },
    ],
  },
  {
    label: "WEBSITE",
    disabled: true,
    items: [
      { id: "prizia-overview", label: "Homepage" },
      { id: "prizia-overview", label: "About" },
      { id: "prizia-overview", label: "Explore" },
      { id: "prizia-overview", label: "Gallery" },
    ],
  },
  {
    label: "PRIZMISTIC",
    disabled: true,
    items: [
      { id: "prizia-overview", label: "Experiences" },
      { id: "prizia-overview", label: "Events" },
      { id: "prizia-overview", label: "Spaces" },
      { id: "prizia-overview", label: "Domains" },
    ],
  },
  {
    label: "CONTENT",
    disabled: true,
    items: [
      { id: "prizia-overview", label: "Announcements" },
      { id: "prizia-overview", label: "Gallery" },
      { id: "prizia-overview", label: "Resources" },
    ],
  },
  {
    label: "SETTINGS",
    disabled: true,
    items: [{ id: "prizia-overview", label: "General" }],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { activeSection, setActiveSection } = useStudio();

  function handleItemClick(item: NavItem) {
    setActiveSection(item.id);
    onNavigate?.();
  }

  return (
    <nav className="flex flex-col h-full py-6 px-4 overflow-y-auto">
      <div className="mb-8 px-2">
        <span className="font-[family-name:var(--font-audiowide)] text-xs tracking-widest text-[#FFF2DB]/40">
          STUDIO
        </span>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {navigation.map((category) => (
          <div key={category.label}>
            <div className="px-2 mb-2">
              <span className="text-[10px] font-semibold tracking-widest text-[#FFF2DB]/25 uppercase">
                {category.label}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {category.items.map((item) => {
                const isActive = activeSection === item.id && !category.disabled;
                const isDisabled = category.disabled;

                return (
                  <button
                    key={item.label}
                    onClick={() => !isDisabled && handleItemClick(item)}
                    disabled={isDisabled}
                    className={`px-3 py-2 rounded-lg text-sm text-left transition ${
                      isDisabled
                        ? "text-[#FFF2DB]/15 cursor-not-allowed"
                        : isActive
                        ? "bg-[#F5A623]/10 text-[#F5A623]"
                        : "text-[#FFF2DB]/45 hover:text-[#FFF2DB]/70 hover:bg-[#FFF2DB]/5"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {item.label}
                      {isDisabled && (
                        <span className="text-[9px] text-[#FFF2DB]/15 tracking-wide">
                          SOON
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
