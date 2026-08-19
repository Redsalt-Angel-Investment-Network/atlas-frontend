"use client";

import { useEffect, useRef, useState } from "react";

type Workspace = {
  id: string;
  name: string;
  role: "Owner" | "Member";
};

const workspaces: Workspace[] = [
  { id: "ws-1", name: "Atlas-1", role: "Owner" },
  { id: "ws-2", name: "Atlas-2", role: "Member" },
  { id: "ws-3", name: "Atlas-3", role: "Member" },
  { id: "ws-4", name: "Btlas-4", role: "Owner" },
];

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export default function WorkspaceSwitcher() {
  const [selectedId, setSelectedId] = useState<string>(workspaces[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const selected =
    workspaces.find((w) => w.id === selectedId) || workspaces[0];

  function handleSelect(workspace: Workspace) {
    if (workspace.id === selectedId) {
      setDropdownOpen(false);
      return;
    }
    setSelectedId(workspace.id);
    setDropdownOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        aria-expanded={dropdownOpen}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-slate-300 transition-colors"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
          {getInitial(selected.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-slate-500">Current workspace</div>
          <div className="truncate text-sm font-medium text-slate-900">
            {selected.name}
          </div>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              My Workspaces
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {workspaces.map((workspace) => {
              const isSelected = workspace.id === selectedId;
              return (
                <button
                  key={workspace.id}
                  onClick={() => handleSelect(workspace)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      getInitial(workspace.name)
                    )}
                  </div>
                  <div className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                    {workspace.name}
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {workspace.role}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}