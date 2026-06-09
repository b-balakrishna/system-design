import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useApp } from "../context/AppContext";
import { topicIdToHash } from "../data";
import type { Phase, Topic } from "../data";
import Mermaid from "./Mermaid";

interface MarkdownProps {
  content: string;
}

function isMermaidPre(node: any): boolean {
  const child = node?.children?.[0];
  const cls = child?.properties?.className;
  return Array.isArray(cls) && cls.includes("language-mermaid");
}

// Convert a relative markdown link href to an app topic ID, or null if not resolvable.
function resolveInternalHref(
  href: string,
  flatTopics: Topic[],
  phases: Phase[]
): string | null {
  // Strip leading ./ or ../
  const clean = href.replace(/^\.\.?\//, "").replace(/\\/g, "/");

  // Topic link: phase-X-something/topic-Y-something.md (or without .md)
  const topicMatch = clean.match(
    /^(phase-\d+-[^/]+)\/(topic-\d+-[^.#]+?)(?:\.md)?(?:#.*)?$/
  );
  if (topicMatch) {
    const id = `${topicMatch[1]}/${topicMatch[2]}`;
    if (flatTopics.some((t) => t.id === id)) return id;
  }

  // Phase folder link: phase-X-something or phase-X-something/
  const phaseSlug = clean.replace(/\/$/, "");
  const phase = phases.find((p) => p.slug === phaseSlug);
  if (phase?.topics[0]) return phase.topics[0].id;

  return null;
}

export default function Markdown({ content }: MarkdownProps) {
  const { flatTopics, phases } = useApp();

  const components: Components = {
    pre({ node, children }: any) {
      if (isMermaidPre(node)) return <>{children}</>;
      return <pre>{children}</pre>;
    },
    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      if (match?.[1] === "mermaid") {
        return <Mermaid code={String(children).trim()} />;
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a({ href, children, ...props }: any) {
      if (!href) return <a {...props}>{children}</a>;

      // External link — open in new tab.
      if (/^https?:\/\//.test(href)) {
        return (
          <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
            {children}
          </a>
        );
      }

      // Section anchor — let the browser scroll to the heading.
      if (href.startsWith("#")) {
        return (
          <a href={href} {...props}>
            {children}
          </a>
        );
      }

      // Internal topic / phase link — rewrite to a short hash URL so the SPA
      // handles navigation without a full page reload.
      const topicId = resolveInternalHref(href, flatTopics, phases);
      if (topicId) {
        return (
          <a href={`#${topicIdToHash(topicId)}`} {...props}>
            {children}
          </a>
        );
      }

      // Fallback — render as-is (may be a mailto, external path, etc.)
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    table({ children, ...props }: any) {
      return (
        <div className="-mx-1 overflow-x-auto">
          <table {...props}>{children}</table>
        </div>
      );
    },
  };

  return (
    <div
      className="prose prose-slate max-w-none dark:prose-invert
        prose-headings:scroll-mt-20 prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:font-extrabold
        prose-h2:border-b prose-h2:border-line prose-h2:pb-2
        prose-a:text-brand-text prose-a:no-underline hover:prose-a:underline
        prose-code:rounded prose-code:bg-sunk prose-code:px-1.5 prose-code:py-0.5
        prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:rounded-xl prose-pre:border prose-pre:border-line prose-pre:bg-sunk
        prose-th:text-left prose-img:rounded-lg
        prose-blockquote:border-brand prose-blockquote:bg-brand-soft/40 prose-blockquote:py-0.5 prose-blockquote:not-italic"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
