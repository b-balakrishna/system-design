import { useEffect, useState } from "react";
import { useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Markdown from "./components/Markdown";
import Home from "./components/Home";
import Glossary from "./components/Glossary";
import CheatSheet, { CHEATSHEET_ID } from "./components/CheatSheet";
import CommandPalette from "./components/CommandPalette";
import { GLOSSARY_ID } from "./glossary";
import type { Topic } from "./data";

function getReadingStats(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

function getModifierKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl K";
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(
    (navigator as any).userAgentData?.platform || navigator.platform || navigator.userAgent || ""
  );
  return isMac ? "⌘K" : "Ctrl K";
}

export default function App() {
  const {
    theme,
    toggleTheme,
    activeId,
    setActiveId,
    mobileOpen,
    setMobileOpen,
    active,
    prev,
    next,
    flatTopics,
    phases,
    completedIds,
    toggleCompleted,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const totalTopics = flatTopics.length;
  const completedCount = completedIds.size;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);
  const readingStats = active ? getReadingStats(active.content) : null;

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [modKey, setModKey] = useState("Ctrl K");

  useEffect(() => {
    setModKey(getModifierKeyLabel());
  }, []);

  // Monitor scroll on main content container for Back to Top button
  useEffect(() => {
    const main = document.querySelector("[data-content]");
    if (!main) return;
    function onScroll() {
      setShowBackToTop((main?.scrollTop || 0) > 400);
    }
    main.addEventListener("scroll", onScroll);
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const main = document.querySelector("[data-content]");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      // Next / Prev topic navigation (Arrow keys or J / K)
      if (e.key === "ArrowRight" || (e.key === "k" && !e.metaKey && !e.ctrlKey)) {
        if (next) setActiveId(next.id);
      } else if (e.key === "ArrowLeft" || (e.key === "j" && !e.metaKey && !e.ctrlKey)) {
        if (prev) setActiveId(prev.id);
      }
      // Toggle Complete (M key)
      else if ((e.key === "m" || e.key === "M") && active) {
        toggleCompleted(active.id);
      }
      // Toggle Theme (T key)
      else if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey) {
        toggleTheme();
      }
      // Command Palette (/ key or Cmd+K / Ctrl+K)
      else if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, prev, next, toggleCompleted, toggleTheme, setActiveId]);

  return (
    <div className="flex h-full flex-col bg-bg text-ink">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-[57px] items-center gap-3 border-b border-line bg-elev px-4">
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-sunk text-base hover:border-line-strong md:hidden"
        >
          ☰
        </button>
        <button
          type="button"
          onClick={() => setActiveId(null)}
          className="flex items-center gap-2 text-base font-bold tracking-tight"
        >
          <span className="text-xl text-brand">⬡</span>
          <span className="hidden sm:inline">System Design</span>
        </button>
        <div className="flex-1" />
        <span
          className="hidden rounded-full border border-line bg-sunk px-3 py-1 text-xs text-ink-soft sm:inline"
          title="Track your personal learning progress"
        >
          {completedCount}/{totalTopics} mastered ({progressPercent}%)
        </span>
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-sunk text-base hover:border-line-strong"
          title="Toggle theme (Press T)"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </header>

      {/* Body */}
      <div className="relative flex min-h-0 flex-1">
        <Sidebar onOpenPalette={() => setIsPaletteOpen(true)} modKey={modKey} />

        {mobileOpen && (
          <div
            className="fixed inset-0 top-[57px] z-20 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <main data-content className="scroll-slim flex-1 overflow-y-auto">
          <article className="mx-auto max-w-prose px-5 pb-24 pt-10 sm:px-8">
            {active ? (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text">
                    <span>Phase {phaseNumOf(active, phases)} · {active.phaseTitle}</span>
                    {readingStats && (
                      <>
                        <span className="text-ink-faint">·</span>
                        <span className="text-ink-soft normal-case font-medium">⏱ ~{readingStats.minutes} min read</span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompleted(active.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                      completedIds.has(active.id)
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        : "border-line bg-sunk text-ink-soft hover:border-line-strong hover:text-ink"
                    }`}
                    title="Toggle completion (Press M)"
                  >
                    <span>{completedIds.has(active.id) ? "✓ Completed" : "○ Mark as Completed"}</span>
                  </button>
                </div>

                {/* Search Match Highlight Banner */}
                {searchQuery && (
                  <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-ink shadow-sm">
                    <span className="flex items-center gap-2">
                      <span>🔍</span>
                      <span>
                        Highlighting matches for:{" "}
                        <strong className="font-bold text-amber-600 dark:text-amber-300">
                          "{searchQuery}"
                        </strong>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded px-2 py-0.5 font-semibold text-ink-soft hover:bg-amber-500/20 hover:text-ink"
                      title="Clear search highlight"
                    >
                      ✕ Clear
                    </button>
                  </div>
                )}

                <Markdown content={active.content} searchQuery={searchQuery} />

                {/* Bottom Completion & Navigation Actions */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(active.id)}
                    className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] ${
                      completedIds.has(active.id)
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                        : "border-line bg-elev text-ink-soft hover:border-brand hover:text-ink"
                    }`}
                  >
                    <span className="text-base font-bold">{completedIds.has(active.id) ? "✓" : "○"}</span>
                    <span>{completedIds.has(active.id) ? "Completed (Click to unmark)" : "Mark Topic as Completed"}</span>
                  </button>

                  {next && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!completedIds.has(active.id)) {
                          toggleCompleted(active.id);
                        }
                        setActiveId(next.id);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-brand bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-brand/90"
                      title="Mark this topic complete and advance to next"
                    >
                      <span>Complete & Next Topic</span>
                      <span>→</span>
                    </button>
                  )}
                </div>

                {/* Prev / next pager */}
                <nav className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
                  {prev ? (
                    <PagerButton dir="prev" topic={prev} />
                  ) : (
                    <span className="hidden sm:block sm:flex-1" />
                  )}
                  {next ? (
                    <PagerButton dir="next" topic={next} />
                  ) : (
                    <span className="hidden sm:block sm:flex-1" />
                  )}
                </nav>
              </>
            ) : activeId === GLOSSARY_ID ? (
              <Glossary />
            ) : activeId === CHEATSHEET_ID ? (
              <CheatSheet />
            ) : (
              <Home />
            )}
          </article>
        </main>

        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-elev/95 text-sm font-bold text-ink shadow-lg backdrop-blur transition-all hover:scale-110 hover:border-brand hover:text-brand"
            title="Back to top (↑)"
          >
            ↑
          </button>
        )}
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
}

function phaseNumOf(topic: Topic, phases: ReturnType<typeof useApp>["phases"]): number | string {
  const phase = phases.find((p) => p.slug === topic.phaseSlug);
  return phase ? phase.num : "";
}

function PagerButton({ dir, topic }: { dir: "prev" | "next"; topic: Topic }) {
  const { setActiveId } = useApp();
  const isNext = dir === "next";
  return (
    <button
      type="button"
      onClick={() => setActiveId(topic.id)}
      className={`flex flex-1 flex-col gap-1 rounded-xl border border-line bg-elev px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-brand sm:max-w-[48%] ${
        isNext ? "text-right" : "text-left"
      }`}
    >
      <span className="text-xs font-semibold text-brand-text">
        {isNext ? "Next →" : "← Previous"}
      </span>
      <span className="text-sm font-semibold text-ink">{topic.title}</span>
    </button>
  );
}
