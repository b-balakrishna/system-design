import { useState, useMemo } from "react";
import { GLOSSARY } from "../glossary";

export default function Glossary() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.map((section) => ({
      ...section,
      terms: section.terms.filter(
        (t) =>
          t.abbr.toLowerCase().includes(q) ||
          t.full.toLowerCase().includes(q) ||
          section.category.toLowerCase().includes(q)
      ),
    })).filter((s) => s.terms.length > 0);
  }, [query]);

  const totalTerms = GLOSSARY.reduce((n, s) => n + s.terms.length, 0);

  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-text">
        Reference
      </div>
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">Glossary</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Full forms for all abbreviations used across this roadmap — {totalTerms} terms.
      </p>

      <input
        type="search"
        placeholder="Search abbreviations or full forms…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search glossary"
        className="mb-8 w-full rounded-lg border border-line bg-sunk px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand focus:ring-2 focus:ring-brand-soft"
      />

      {filtered.length === 0 && (
        <p className="text-sm text-ink-faint">No terms match "{query}".</p>
      )}

      <div className="flex flex-col gap-8">
        {filtered.map((section) => (
          <section key={section.category}>
            <h2 className="mb-3 border-b border-line pb-2 text-base font-bold tracking-tight text-ink">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {section.terms.map((term) => (
                <div
                  key={term.abbr}
                  className="flex items-baseline gap-3 rounded-lg border border-line bg-elev px-4 py-2.5"
                >
                  <span className="min-w-[72px] shrink-0 font-mono text-[13px] font-bold text-brand-text">
                    {term.abbr}
                  </span>
                  <span className="text-[13px] text-ink-soft leading-snug">{term.full}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
