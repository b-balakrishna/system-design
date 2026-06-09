import { useApp } from "../context/AppContext";
import Markdown from "./Markdown";

export default function Home() {
  const { phases, readme, setActiveId } = useApp();

  return (
    <div>
      {readme ? (
        <Markdown content={readme} />
      ) : (
        <h1 className="text-3xl font-extrabold">System Design Notes</h1>
      )}

      <h2 className="mb-4 mt-11 text-xl font-bold tracking-tight">Browse by phase</h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((p) => {
          const first = p.topics[0];
          const pct = p.topicCount ? (p.doneCount / p.topicCount) * 100 : 0;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => first && setActiveId(first.id)}
              className="rounded-xl border border-line bg-elev p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
            >
              <div className="text-[11.5px] font-bold uppercase tracking-wider text-brand-text">
                Phase {p.num}
              </div>
              <div className="mb-2 mt-1 text-[15px] font-bold">{p.title}</div>
              <div className="mb-2.5 text-xs text-ink-soft">
                {p.doneCount}/{p.topicCount} topics written
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sunk">
                <span
                  className="block h-full rounded-full bg-brand transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
