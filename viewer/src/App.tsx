import { useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Markdown from "./components/Markdown";
import Home from "./components/Home";
import Glossary from "./components/Glossary";
import { GLOSSARY_ID } from "./glossary";
import type { Topic } from "./data";

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
  } = useApp();

  const totalDone = flatTopics.filter((t) => !t.empty).length;
  const totalTopics = flatTopics.length;

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
        <span className="hidden rounded-full border border-line bg-sunk px-3 py-1 text-xs text-ink-soft sm:inline">
          {totalDone}/{totalTopics} written
        </span>
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-sunk text-base hover:border-line-strong"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </header>

      {/* Body */}
      <div className="relative flex min-h-0 flex-1">
        <Sidebar />

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
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-text">
                  Phase {phaseNumOf(active, phases)} · {active.phaseTitle}
                </div>

                {active.empty ? (
                  <div className="py-8">
                    <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
                      {active.title}
                    </h1>
                    <p className="mb-2">This topic hasn't been written yet.</p>
                    <p className="text-sm text-ink-faint">
                      Add notes to{" "}
                      <code className="rounded bg-sunk px-1.5 py-0.5 font-mono text-[0.85em]">
                        {active.phaseSlug}/{active.slug}.md
                      </code>{" "}
                      and they'll appear here.
                    </p>
                  </div>
                ) : (
                  <Markdown content={active.content} />
                )}

                {/* Prev / next pager */}
                <nav className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
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
            ) : (
              <Home />
            )}
          </article>
        </main>
      </div>
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
