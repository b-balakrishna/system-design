import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useApp } from "../context/AppContext";

interface MermaidProps {
  code: string;
}

let idCounter = 0;

export default function Mermaid({ code }: MermaidProps) {
  const { theme } = useApp();
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = `mmd-${(idCounter += 1)}`;

    async function render() {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "inherit",
          flowchart: { curve: "basis", htmlLabels: true },
        });
        const { svg: out } = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(out);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  if (error) {
    return (
      <div className="my-5 rounded-xl border border-line-strong bg-sunk p-4 text-ink-soft">
        <p className="mb-2 text-sm">Could not render diagram.</p>
        <pre className="overflow-x-auto text-xs">{code}</pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-container my-5 flex justify-center overflow-x-auto rounded-xl border border-line bg-elev p-4 shadow-card sm:p-6"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
