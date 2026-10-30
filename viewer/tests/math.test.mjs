import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDisplayMath from "../src/plugins/remarkDisplayMath.ts";

function renderMarkdown(content) {
  return renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm, remarkMath, remarkDisplayMath],
        rehypePlugins: [rehypeKatex],
      },
      content
    )
  );
}

function countClass(html, className) {
  return html.split(`class="${className}"`).length - 1;
}

test("renders the Write QPS equation as display math and single dollars inline", () => {
  const html = renderMarkdown(
    String.raw`- **Write QPS**: $$\text{Write QPS} = \frac{100\text{M}}{30 \times 86{,}400} \approx 40\text{ writes/sec}$$ Peak write QPS ($\times 2$) $\approx 80\text{ writes/sec}$.`
  );

  assert.equal(countClass(html, "katex-display"), 1);
  assert.equal(countClass(html, "katex"), 3);
  assert.match(html, /<math[^>]*display="block"/);
  assert.match(html, /<annotation encoding="application\/x-tex">/);
  assert.doesNotMatch(html, /katex-error|\$\$/);
});

test("keeps ordinary inline math inline and supports multiline display math", () => {
  const inline = renderMarkdown(String.raw`Lookup takes $O(\log N)$ time.`);
  assert.equal(countClass(inline, "katex"), 1);
  assert.equal(countClass(inline, "katex-display"), 0);

  const display = renderMarkdown("$$\n\\frac{1}{2}\n$$");
  assert.equal(countClass(display, "katex-display"), 1);
  assert.doesNotMatch(display, /katex-error/);
});

test("preserves dollar signs in inline code, Mermaid, and other code fences", () => {
  const html = renderMarkdown(
    [
      "Static member: `+getInstance()$`; price tiers: `$` / `$$` / `$$$`.",
      "",
      "```mermaid",
      "classDiagram",
      "class IdGenerator {",
      "  +getInstance()$ IdGenerator",
      "}",
      "```",
      "",
      "```graphql",
      "query GetUser($userId: ID!) { user(id: $userId) { id } }",
      "```",
    ].join("\n")
  );

  assert.equal(countClass(html, "katex"), 0);
  assert.match(html, /<code>\+getInstance\(\)\$<\/code>/);
  assert.match(html, /<code>\$\$<\/code>/);
  assert.match(html, /<code>\$\$\$<\/code>/);
  assert.match(html, /class="language-mermaid"/);
  assert.match(html, /\+getInstance\(\)\$ IdGenerator/);
  assert.match(html, /query GetUser\(\$userId: ID!\)/);
});

test("keeps escaped currency and static classifiers as prose beside math", () => {
  const html = renderMarkdown(
    [
      "Reading the diagram (\\$ = static): a trailing `$` marks a static member.",
      "",
      "Prices range from \\$5 to \\$50. Store USD as **Cents** (\\$10.50 $\\rightarrow$ `1050`).",
    ].join("\n")
  );

  assert.equal(countClass(html, "katex"), 1);
  assert.equal(countClass(html, "katex-display"), 0);
  assert.match(html, /\(\$ = static\)/);
  assert.match(html, /Prices range from \$5 to \$50/);
  assert.match(html, /\$10\.50/);
  assert.match(html, /<code>\$<\/code>/);
  assert.doesNotMatch(html, /katex-error/);
});

test("renders every curriculum topic and README without math errors", async () => {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const entries = await readdir(root, { withFileTypes: true });
  const files = [path.join(root, "README.md")];

  for (const entry of entries) {
    if (!entry.isDirectory() || !/^phase-\d+-/.test(entry.name)) continue;
    const directory = path.join(root, entry.name);
    for (const name of await readdir(directory)) {
      if (/^topic-.*\.md$/.test(name)) files.push(path.join(directory, name));
    }
  }

  assert.ok(files.length > 1, "expected to discover curriculum topics");
  for (const file of files) {
    const html = renderMarkdown(await readFile(file, "utf8"));
    assert.doesNotMatch(html, /class="katex-error"/, path.relative(root, file));
  }
});
