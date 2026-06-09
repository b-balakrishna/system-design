# System Design — Notes Viewer

A **React + TypeScript + Vite** app, styled with **Tailwind CSS**, that reads
every markdown note in this repo (`../phase-*/*.md` and `../README.md`) and
renders them beautifully — with Mermaid diagrams, GFM tables, search,
deep-linkable topics, light/dark themes, and a fully responsive layout.

## Features

- Sidebar grouped by phase, with per-phase progress and live search.
- Renders Mermaid diagrams (the ```mermaid blocks in your notes) inline, re-themed for light/dark.
- GitHub-flavoured markdown via `@tailwindcss/typography`: tables, task lists, strikethrough.
- Light / dark theme, remembered across visits and matched to your OS preference.
- Fully responsive — collapsible drawer sidebar on mobile, multi-column phase grid on desktop.
- Shareable URLs — each topic has its own `#phase/topic` hash, with back/forward support.
- Previous / next navigation and a phase overview on the home page.
- Empty topics show a "coming soon" state, so the viewer grows as you fill in notes.

## Stack

- React 18 + TypeScript
- Vite 5 (build tooling)
- Tailwind CSS 3 + `@tailwindcss/typography`
- `react-markdown` + `remark-gfm`
- `mermaid` for diagrams

## Run it

From inside the `viewer/` folder:

```bash
pnpm install
pnpm dev
```

Then open the printed local URL (usually http://localhost:5173).

## Other scripts

```bash
pnpm typecheck   # tsc --noEmit
pnpm build       # type-check, then build to viewer/dist
pnpm preview     # serve the production build locally
```

The notes are bundled at build time, so `dist/` is fully self-contained and can
be hosted anywhere (GitHub Pages, Netlify, any static host).

## How it picks up your notes

`src/data.ts` globs `../../phase-*/*.md` and groups files by their folder
(`phase-N-*`) and filename (`topic-N-*`). The topic title comes from the first
`# Heading` in each file, falling back to the filename. Add a new markdown file
following that naming pattern and it appears in the sidebar automatically — no
code changes needed.

## Project structure

```text
viewer/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx          # entry
    ├── App.tsx           # layout, theme, routing, pager
    ├── data.ts           # loads + parses all markdown notes
    ├── styles.css        # Tailwind entry + theme tokens
    └── components/
        ├── Sidebar.tsx   # phase/topic nav + search
        ├── Markdown.tsx  # react-markdown + custom renderers
        └── Mermaid.tsx   # diagram rendering
```
