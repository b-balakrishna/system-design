import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { GLOSSARY_ID } from "../glossary";
import { CHEATSHEET_ID } from "./CheatSheet";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: string;
  badge?: string;
  content?: string;
  isCompleted?: boolean;
}

export function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-amber-400/40 px-1 py-0.5 font-bold text-ink not-italic shadow-sm dark:bg-amber-400/30 dark:text-amber-200"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function getContentSnippet(content: string, query: string): string | null {
  if (!query.trim() || !content) return null;
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerContent.indexOf(lowerQuery);
  if (idx === -1) return null;
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 70);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";
  return prefix + content.slice(start, end).replace(/[#*_`]/g, "").replace(/\s+/g, " ") + suffix;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { flatTopics, phases, setActiveId, completedIds, setSearchQuery } = useApp();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allItems: PaletteItem[] = useMemo(() => {
    const items: PaletteItem[] = [];

    // Special Pages
    items.push({ id: CHEATSHEET_ID, title: "System Design Numbers Cheat Sheet", category: "Reference", badge: "Cheat Sheet" });
    items.push({ id: GLOSSARY_ID, title: "Glossary of Architectural Acronyms", category: "Reference", badge: "Glossary" });

    // Topics
    for (const t of flatTopics) {
      const phase = phases.find((p) => p.slug === t.phaseSlug);
      items.push({
        id: t.id,
        title: t.title,
        category: t.phaseTitle || "Topic",
        badge: phase ? `P${phase.num}` : undefined,
        content: t.content,
        isCompleted: completedIds.has(t.id),
      });
    }

    return items;
  }, [flatTopics, phases, completedIds]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 15);

    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.content && item.content.toLowerCase().includes(q))
      )
      .slice(0, 25);
  }, [allItems, query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  function handleSelect(item: PaletteItem) {
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
    if (item.id === CHEATSHEET_ID) {
      setActiveId(CHEATSHEET_ID);
    } else if (item.id === GLOSSARY_ID) {
      setActiveId(GLOSSARY_ID);
    } else {
      setActiveId(item.id);
    }
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-elev shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="text-base text-brand">⬡</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${flatTopics.length} topics, phases, keywords, or references...`}
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-ink-faint hover:text-ink"
            >
              Clear
            </button>
          )}
          <kbd className="rounded border border-line bg-sunk px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <ul ref={listRef} className="scroll-slim max-h-[60vh] overflow-y-auto p-2">
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const snippet =
              query.trim() && item.content
                ? getContentSnippet(item.content, query)
                : null;

            return (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isSelected ? "bg-brand-soft text-brand-text font-medium" : "text-ink hover:bg-sunk"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    {item.badge && (
                      <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold text-brand-text">
                        {item.badge}
                      </span>
                    )}
                    <span className="truncate">
                      <HighlightMatch text={item.title} query={query} />
                    </span>
                    {item.isCompleted && (
                      <span className="text-xs font-bold text-emerald-500" title="Completed">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="max-w-[180px] shrink-0 truncate text-xs text-ink-faint">
                    <HighlightMatch text={item.category} query={query} />
                  </span>
                </div>

                {/* Content Snippet Highlight */}
                {snippet && !item.title.toLowerCase().includes(query.trim().toLowerCase()) && (
                  <div className="line-clamp-1 pl-7 text-xs text-ink-soft">
                    <HighlightMatch text={snippet} query={query} />
                  </div>
                )}
              </li>
            );
          })}
          {filteredItems.length === 0 && (
            <li className="py-8 text-center text-sm text-ink-faint">
              No topics or references match "{query}".
            </li>
          )}
        </ul>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between border-t border-line bg-sunk/50 px-4 py-2 text-[11px] text-ink-faint">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-line bg-elev px-1 py-0.5 font-mono">↑</kbd>{" "}
              <kbd className="rounded border border-line bg-elev px-1 py-0.5 font-mono">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded border border-line bg-elev px-1 py-0.5 font-mono">↵</kbd> to open & highlight
            </span>
          </div>
          <span>{flatTopics.length} Topics Available</span>
        </div>
      </div>
    </div>
  );
}
