# Contributing to System Design Notes & Roadmap

Thank you for your interest in contributing to the **System Design Notes & Interview Roadmap** repository! This project serves as a comprehensive, production-grade guide spanning 205 topics across 9 phases.

To maintain world-class quality, consistency, and automated test passes, please follow the guidelines below.

---

## 1. Structure & Topic Organization

The curriculum is organized into 9 contiguous phases:
- **Phase 0**: System Design Interview Primer & Framework
- **Phase 1**: Low-Level Design & Object-Oriented Principles
- **Phase 2**: Foundations & Infrastructure
- **Phase 3**: Backend & Distributed Systems Architecture
- **Phase 4**: Distributed Systems Deep Dives & Consensus
- **Phase 5**: Frontend & Modern Web Architecture
- **Phase 6**: Cloud Infrastructure, SRE & Observability
- **Phase 7**: Applied AI, Machine Learning & LLM Systems
- **Phase 8**: Real-World Case Studies (Batches 1 to 5)

Each topic lives in its respective `phase-*` directory as a Markdown file:
```text
phase-{N}-{category}/topic-{M}-{slug}.md
```

---

## 2. Standard Topic Structure (The 6-Step Framework)

Every technical topic or case study must adhere to the standardized 6-step framework:
1. **Step 1: Clarify Requirements**: Functional vs Non-Functional requirements, clear scope, SLAs/SLOs.
2. **Step 2: Capacity Estimation**: Back-of-the-envelope calculations with concrete math (DAU, QPS, bandwidth, 5-year storage).
3. **Step 3: API & Internal Contracts**: Clean REST/gRPC endpoint definitions with JSON request/response payloads.
4. **Step 4: Data Model & Schema**: Database engine justification and SQL/NoSQL schema with indexes.
5. **Step 5: High-Level Architecture**: Complete end-to-end architecture diagram using Mermaid, followed by bulleted request lifecycle steps.
6. **Step 6: Deep Dive**: 2-3 complex engineering trade-offs (e.g., concurrency control, caching strategies, failure modes, consistency models).

---

## 3. Formatting & Style Rules

To preserve readability, accessibility, and automated quality gates:
- **No AI Em-Dashes**: Do NOT use the unicode em-dash (`\u2014`). Instead, use a colon (`: `) for bold lead-ins and standard hyphens (`-`).
- **Mathematical Formats**: Wrap equations in LaTeX syntax (e.g., `$$QPS = \frac{\text{Total Events}}{86{,}400}$$`).
- **Horizontal Rules**: Always use `---` (never ` - `).
- **Code Fences**: Always specify language identifiers (e.g. ```` ```sql ````, ```` ```json ````, ```` ```tsx ````, ```` ```mermaid ````).

---

## 4. Mermaid Diagram Standards

All diagrams must parse cleanly in our custom Mermaid viewer:
- **Node Labels**: Quote any label containing parentheses, brackets, or commas:
  - **Correct**: `APIGW["API Gateway (KrakenD / Envoy)"]`
  - **Incorrect**: `APIGW[API Gateway (KrakenD / Envoy)]`
- **Edge Comparison Operators**: Always enclose comparison operators (`<`, `>`, `<=`, `>=`) in quotes inside edge pipes:
  - **Correct**: `-->|"Under 25,000"|` or `-->|"< 25k"|`
  - **Incorrect**: `-->|< 25k|`
- **Chained Connections**: Never chain multiple source nodes to a dotted labeled arrow:
  - **Correct**:
    ```mermaid
    Worker1 -.->|Record| DB
    Worker2 -.-> DB
    ```
  - **Incorrect**: `Worker1 & Worker2 -.->|Record| DB`

---

## 5. Running Verification Locally

Before submitting a pull request, run the repository verification script:

```bash
# 1. Verify link integrity, cross-references, Mermaid syntax, and style
python scripts/verify-repo.py

# 2. Verify viewer TypeScript compilation
npm --prefix viewer run typecheck

# 3. Test viewer production build
npm --prefix viewer run build
```

Pull requests will automatically run `python scripts/verify-repo.py` and `npm run typecheck` in GitHub Actions. All checks must pass before merging.
