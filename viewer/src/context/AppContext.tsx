import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  phases as allPhases,
  flatTopics as allFlatTopics,
  findTopic,
  hashToTopicId,
  topicIdToHash,
  readme as repoReadme,
  type Phase,
  type Topic,
} from "../data";
import { GLOSSARY_ID } from "../glossary";
import { CHEATSHEET_ID } from "../components/CheatSheet";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const saved =
    typeof localStorage !== "undefined" && localStorage.getItem("sd-theme");
  if (saved === "light" || saved === "dark") return saved;
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

function getInitialCompleted(): Set<string> {
  try {
    const saved = localStorage.getItem("sd-completed-topics");
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch {
    /* ignore */
  }
  return new Set<string>();
}

// Parse the URL hash into an app-internal topic ID (or special page ID).
function parseHash(): string | null {
  const h = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (!h) return null;
  if (h === GLOSSARY_ID) return GLOSSARY_ID;
  if (h === CHEATSHEET_ID || h === "cheatsheet") return CHEATSHEET_ID;
  const fromShort = hashToTopicId(h);
  if (fromShort) return fromShort;
  if (findTopic(h)) return h; // legacy long-form bookmark
  return null;
}

// Encode an internal ID back to the short URL hash string.
function idToHash(id: string | null): string {
  if (!id) return "";
  if (id === GLOSSARY_ID) return GLOSSARY_ID;
  if (id === CHEATSHEET_ID) return "cheatsheet";
  return topicIdToHash(id);
}

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  phases: Phase[];
  flatTopics: Topic[];
  active: Topic | null;
  prev: Topic | null;
  next: Topic | null;
  readme: string;
  completedIds: Set<string>;
  toggleCompleted: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [activeId, setActiveIdRaw] = useState<string | null>(parseHash);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("sd-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Keep the URL hash in sync — always write the short format.
  useEffect(() => {
    const hash = idToHash(activeId);
    const next = hash ? `#${hash}` : "#";
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [activeId]);

  // React to browser back/forward.
  useEffect(() => {
    function onHashChange() {
      setActiveIdRaw(parseHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Scroll content area to top on navigation.
  useEffect(() => {
    const main = document.querySelector("[data-content]");
    if (main) main.scrollTop = 0;
  }, [activeId]);

  function setActiveId(id: string | null) {
    setActiveIdRaw(id);
    setMobileOpen(false);
  }

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  const [completedIds, setCompletedIds] = useState<Set<string>>(getInitialCompleted);

  function toggleCompleted(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("sd-completed-topics", JSON.stringify(Array.from(next)));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const active = activeId ? findTopic(activeId) : null;

  const { prev, next } = useMemo(() => {
    if (!active) return { prev: null as Topic | null, next: null as Topic | null };
    const idx = allFlatTopics.findIndex((t) => t.id === active.id);
    return {
      prev: idx > 0 ? allFlatTopics[idx - 1] : null,
      next: idx >= 0 && idx < allFlatTopics.length - 1 ? allFlatTopics[idx + 1] : null,
    };
  }, [active]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeId,
        setActiveId,
        mobileOpen,
        setMobileOpen,
        phases: allPhases,
        flatTopics: allFlatTopics,
        active,
        prev,
        next,
        readme: repoReadme,
        completedIds,
        toggleCompleted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
