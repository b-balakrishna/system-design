import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { GLOSSARY_ID } from "../glossary";
import type { Phase, Topic } from "../data";

export default function Sidebar() {
  const { phases, activeId, setActiveId, mobileOpen } = useApp();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return phases;
    return phases
      .map((p) => ({
        ...p,
        topics: p.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            p.title.toLowerCase().includes(q)
        ),
      }))
      .filter((p) => p.topics.length > 0);
  }, [phases, query]);

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

      <div className="my-3.5 px-1.5">
        <input
          type="search"
          placeholder="Search topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search topics"
          className="w-full rounded-lg border border-line bg-sunk px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand focus:ring-2 focus:ring-brand-soft"
        />
      </div>

      <nav className="flex flex-col gap-0.5">
        {filtered.map((phase) => (
          <PhaseGroup
            key={phase.slug}
            phase={phase}
            activeId={activeId}
            onSelect={setActiveId}
            forceOpen={query.trim().length > 0}
          />
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-sm text-ink-faint">
            No topics match "{query}".
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
  const active = topic.id === activeId;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(topic.id)}
        title={topic.empty ? "Not written yet" : topic.title}
        className={`flex w-full items-baseline gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors ${
          active
            ? "bg-brand-soft font-semibold text-brand-text"
            : topic.empty
              ? "text-ink-faint hover:bg-sunk"
              : "text-ink-soft hover:bg-sunk hover:text-ink"
        }`}
      >
        <span className="min-w-[14px] text-[11px] tabular-nums text-ink-faint">
          {topic.num}
        </span>
        <span className="flex-1">{topic.title}</span>
        {topic.empty && (
          <span className="rounded border border-line px-1.5 text-[9.5px] uppercase tracking-wide text-ink-faint">
            soon
          </span>
        )}
      </button>
    </li>
  );
}
