import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { GLOSSARY_ID } from "../glossary";
import { CHEATSHEET_ID } from "./CheatSheet";
import type { Phase, Topic } from "../data";

type FilterMode = "all" | "unread" | "completed";

interface SidebarProps {
  onOpenPalette: () => void;
  modKey: string;
}

export default function Sidebar({ onOpenPalette, modKey }: SidebarProps) {
  const { phases, activeId, setActiveId, mobileOpen, completedIds } = useApp();
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = useMemo(() => {
    return phases
      .map((p) => ({
        ...p,
        topics: p.topics.filter((t) => {
          if (filter === "unread" && completedIds.has(t.id)) return false;
          if (filter === "completed" && !completedIds.has(t.id)) return false;
          return true;
        }),
      }))
      .filter((p) => p.topics.length > 0);
  }, [phases, filter, completedIds]);

  const totalTopics = useMemo(() => phases.reduce((acc, p) => acc + p.topics.length, 0), [phases]);

  return (
    <aside
      className={`scroll-slim fixed inset-y-0 left-0 top-[57px] z-30 w-[300px] overflow-y-auto border-r border-line bg-elev px-3 pb-12 pt-4 shadow-card transition-transform duration-200 md:static md:top-0 md:z-0 md:shadow-none ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <button
        type="button"
        onClick={() => setActiveId(null)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          activeId === null
            ? "bg-brand-soft text-brand-text"
            : "text-ink-soft hover:bg-sunk hover:text-ink"
        }`}
      >
        <span className="text-[11px] text-brand">◆</span>
        <span>Overview</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveId(GLOSSARY_ID)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          activeId === GLOSSARY_ID
            ? "bg-brand-soft text-brand-text"
            : "text-ink-soft hover:bg-sunk hover:text-ink"
        }`}
      >
        <span className="text-[11px] text-brand">≡</span>
        <span>Glossary</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveId(CHEATSHEET_ID)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          activeId === CHEATSHEET_ID
            ? "bg-brand-soft text-brand-text"
            : "text-ink-soft hover:bg-sunk hover:text-ink"
        }`}
      >
        <span className="text-[11px] text-brand">⚡</span>
        <span>Numbers Cheat Sheet</span>
      </button>

      {/* Search Trigger Button (Opens Spotlight Palette) */}
      <div className="my-3 px-0.5">
        <button
          type="button"
          onClick={onOpenPalette}
          className="group flex w-full items-center justify-between rounded-xl border border-line bg-sunk px-3 py-2 text-xs text-ink-soft shadow-sm transition-all hover:border-line-strong hover:bg-elev hover:text-ink"
          title={`Search all topics (Press ${modKey} or /)`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🔍</span>
            <span>Search {totalTopics} topics...</span>
          </div>
          <kbd className="rounded border border-line bg-elev px-1.5 py-0.5 font-mono text-[10px] text-ink-soft group-hover:border-line-strong group-hover:text-ink">
            {modKey}
          </kbd>
        </button>
      </div>

      {/* 3-Way Study Progress Filter */}
      <div className="mb-3 flex rounded-lg border border-line bg-sunk p-0.5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`flex-1 rounded-md py-1 text-center transition-colors ${
            filter === "all" ? "bg-elev text-ink shadow-sm" : "text-ink-soft hover:text-ink"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`flex-1 rounded-md py-1 text-center transition-colors ${
            filter === "unread" ? "bg-elev text-brand-text shadow-sm" : "text-ink-soft hover:text-ink"
          }`}
        >
          Unread
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`flex-1 rounded-md py-1 text-center transition-colors ${
            filter === "completed" ? "bg-elev text-emerald-500 shadow-sm" : "text-ink-soft hover:text-ink"
          }`}
        >
          Done
        </button>
      </div>

      <nav className="flex flex-col gap-0.5">
        {filtered.map((phase) => (
          <PhaseGroup
            key={phase.slug}
            phase={phase}
            activeId={activeId}
            onSelect={setActiveId}
            forceOpen={filter !== "all"}
          />
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-faint">
            {filter === "completed"
              ? "No topics marked completed yet."
              : "All topics in this view are completed!"}
          </p>
        )}
      </nav>
    </aside>
  );
}

interface PhaseGroupProps {
  phase: Phase;
  activeId: string | null;
  onSelect: (id: string) => void;
  forceOpen: boolean;
}

function PhaseGroup({ phase, activeId, onSelect, forceOpen }: PhaseGroupProps) {
  const hasActive = phase.topics.some((t) => t.id === activeId);
  const [open, setOpen] = useState(hasActive || phase.num === 0);
  const expanded = forceOpen || open || hasActive;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-sunk"
      >
        <span
          className={`text-ink-faint transition-transform ${expanded ? "rotate-90" : ""}`}
        >
          ›
        </span>
        <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold text-brand-text">
          P{phase.num}
        </span>
        <span className="flex-1 truncate font-semibold text-ink">
          {phase.title}
        </span>
        <span className="text-[11px] tabular-nums text-ink-faint">
          {phase.doneCount}/{phase.topicCount}
        </span>
      </button>

      {expanded && (
        <ul className="ml-4 border-l border-line pl-2">
          {phase.topics.map((t) => (
            <TopicItem key={t.id} topic={t} activeId={activeId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </div>
  );
}

interface TopicItemProps {
  topic: Topic;
  activeId: string | null;
  onSelect: (id: string) => void;
}

function TopicItem({ topic, activeId, onSelect }: TopicItemProps) {
  const { completedIds } = useApp();
  const active = topic.id === activeId;
  const isDone = completedIds.has(topic.id);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(topic.id)}
        title={topic.title}
        className={`flex w-full items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors ${
          active
            ? "bg-brand-soft font-semibold text-brand-text"
            : isDone
              ? "text-ink/80 hover:bg-sunk hover:text-ink"
              : "text-ink-soft hover:bg-sunk hover:text-ink"
        }`}
      >
        <span className="min-w-[14px] text-[11px] tabular-nums text-ink-faint">
          {topic.num}
        </span>
        <span className="flex-1 truncate">{topic.title}</span>
        {isDone && (
          <span className="text-[11px] font-bold text-emerald-500" title="Completed">
            ✓
          </span>
        )}
      </button>
    </li>
  );
}
