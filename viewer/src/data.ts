// Loads every markdown note in the repo at build time and shapes it into a
// navigable tree of phases -> topics. Uses Vite's import.meta.glob with a raw
// import so the built site is fully self-contained (no runtime fetching).

export interface Topic {
  id: string;
  num: number;
  slug: string;
  title: string;
  content: string;
  empty: boolean;
  phaseSlug?: string;
  phaseTitle?: string;
}

export interface Phase {
  num: number;
  slug: string;
  title: string;
  topics: Topic[];
  topicCount: number;
  doneCount: number;
}

const topicModules = import.meta.glob("../../phase-*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const readmeModules = import.meta.glob("../../README.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const readme: string = Object.values(readmeModules)[0] || "";

const SMALL_WORDS = new Set([
  "a", "an", "and", "the", "of", "vs", "to", "in", "on", "for", "at", "by",
]);

// Technical terms with canonical casing, keyed by their lowercase slug word.
const TERM_MAP: Record<string, string> = {
  // Protocols & transport
  http: "HTTP",      https: "HTTPS",
  http2: "HTTP/2",   http3: "HTTP/3",    quic: "QUIC",
  grpc: "gRPC",      tcp: "TCP",         udp: "UDP",
  tls: "TLS",        ssl: "SSL",
  websocket: "WebSocket",  websockets: "WebSockets",
  // APIs & auth
  api: "API",        apis: "APIs",       rest: "REST",
  graphql: "GraphQL",
  oauth: "OAuth",    openid: "OpenID",   jwt: "JWT",
  cors: "CORS",      csrf: "CSRF",       xss: "XSS",
  // Databases
  sql: "SQL",        nosql: "NoSQL",
  // Infra & networking
  cdn: "CDN",        dns: "DNS",         osi: "OSI",
  aws: "AWS",        ci: "CI",           cd: "CD",
  // Frontend rendering patterns
  csr: "CSR",        ssr: "SSR",         ssg: "SSG",
  isr: "ISR",        sse: "SSE",         spa: "SPA",    pwa: "PWA",
  // Architecture / design
  uml: "UML",        lld: "LLD",         solid: "SOLID",
  cqrs: "CQRS",      crdt: "CRDT",       crdts: "CRDTs",
  cap: "CAP",        pacelc: "PACELC",
  // AI / ML
  ai: "AI",          ml: "ML",
  llm: "LLM",        llms: "LLMs",       rag: "RAG",
  // Web platform
  url: "URL",        urls: "URLs",
  dom: "DOM",        html: "HTML",       css: "CSS",
  // Tools & runtimes
  javascript: "JavaScript",  typescript: "TypeScript",
  redis: "Redis",    kubernetes: "Kubernetes",  docker: "Docker",
  // Misc abbreviations
  ui: "UI",          ux: "UX",
  id: "ID",          ids: "IDs",
  sdk: "SDK",        cli: "CLI",         rpc: "RPC",
  a11y: "a11y",
};

// Full-slug overrides for slugs that contain version numbers or other
// patterns the word-level map cannot reconstruct correctly.
const SLUG_OVERRIDES: Record<string, string> = {
  "oauth-2-0-and-openid-connect": "OAuth 2.0 and OpenID Connect",
  "a-b-testing-models": "A/B Testing Models",
};

function titleCase(slug: string): string {
  if (slug in SLUG_OVERRIDES) return SLUG_OVERRIDES[slug];
  return slug
    .split("-")
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (lower in TERM_MAP) return TERM_MAP[lower];
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

// Pull the first H1 ("# Title") from a markdown body, if present.
function firstHeading(md: string): string | null {
  const match = md.match(/^\s*#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

interface PhaseMeta {
  num: number;
  slug: string;
  title: string;
}

function parsePhase(folder: string): PhaseMeta {
  // folder e.g. "phase-0-interview-primer"
  const m = folder.match(/^phase-(\d+)-(.+)$/);
  if (!m) return { num: 999, slug: folder, title: titleCase(folder) };
  return { num: Number(m[1]), slug: folder, title: titleCase(m[2]) };
}

interface TopicMeta {
  num: number;
  slug: string;
  fallbackTitle: string;
}

function parseTopic(file: string): TopicMeta {
  // file e.g. "topic-3-capacity-estimation.md"
  const base = file.replace(/\.md$/, "");
  const m = base.match(/^topic-(\d+)-(.+)$/);
  if (!m) return { num: 999, slug: base, fallbackTitle: titleCase(base) };
  return { num: Number(m[1]), slug: base, fallbackTitle: titleCase(m[2]) };
}

const phaseMap = new Map<string, Phase>();

for (const [path, content] of Object.entries(topicModules)) {
  // path e.g. "../../phase-0-interview-primer/topic-1-the-6-step-framework.md"
  const parts = path.split("/");
  const folder = parts[parts.length - 2];
  const file = parts[parts.length - 1];

  const phaseInfo = parsePhase(folder);
  const topicInfo = parseTopic(file);
  const body = (content || "").trim();

  if (!phaseMap.has(phaseInfo.slug)) {
    phaseMap.set(phaseInfo.slug, {
      ...phaseInfo,
      topics: [],
      topicCount: 0,
      doneCount: 0,
    });
  }

  phaseMap.get(phaseInfo.slug)!.topics.push({
    id: `${phaseInfo.slug}/${topicInfo.slug}`,
    num: topicInfo.num,
    slug: topicInfo.slug,
    title: firstHeading(body) || topicInfo.fallbackTitle,
    content: body,
    empty: body.length === 0,
  });
}

export const phases: Phase[] = Array.from(phaseMap.values())
  .map((p) => {
    const topics = p.topics.sort((a, b) => a.num - b.num);
    return {
      ...p,
      topics,
      topicCount: topics.length,
      doneCount: topics.filter((t) => !t.empty).length,
    };
  })
  .sort((a, b) => a.num - b.num);

// Flat, ordered list of all topics — used for prev/next navigation.
export const flatTopics: Topic[] = phases.flatMap((p) =>
  p.topics.map((t) => ({ ...t, phaseSlug: p.slug, phaseTitle: p.title }))
);

export function findTopic(id: string): Topic | null {
  return flatTopics.find((t) => t.id === id) || null;
}

// Hash format: "/{phase-name}/{topic-name}" e.g. "/distributed-systems/consistent-hashing"
// (the numeric "phase-N-" and "topic-N-" prefixes are stripped).
export function topicIdToHash(id: string): string {
  const m = id.match(/^phase-\d+-([^/]+)\/topic-\d+-(.+)$/);
  return m ? `/${m[1]}/${m[2]}` : id;
}

export function hashToTopicId(hash: string): string | null {
  // Current format: "/phase-name/topic-name"
  const m = hash.match(/^\/([^/]+)\/(.+)$/);
  if (m) {
    const phase = phases.find((p) => p.slug.replace(/^phase-\d+-/, "") === m[1]);
    const topic = phase?.topics.find((t) => t.slug.replace(/^topic-\d+-/, "") === m[2]);
    if (topic) return topic.id;
  }
  // Legacy format: "0/1" (numeric phase/topic numbers)
  const legacy = hash.match(/^(\d+)\/(\d+)$/);
  if (legacy) {
    const phase = phases.find((p) => p.num === Number(legacy[1]));
    const topic = phase?.topics.find((t) => t.num === Number(legacy[2]));
    if (topic) return topic.id;
  }
  return null;
}
