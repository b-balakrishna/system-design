# Frontend Observability & RUM

## Concept

- **Frontend observability** is knowing what's actually happening in users' browsers — errors, performance, and behavior — in production, on real devices and networks. Backend observability (Phase 6) doesn't see the client; this closes that gap.
- Its pillars:
  - **Real User Monitoring (RUM)** — collect **field** performance data from actual users: Core Web Vitals (LCP/INP/CLS, topic 25), load times, segmented by device, geography, connection, and page. Contrasts with **synthetic** lab monitoring (Lighthouse) which tests in a controlled environment.
  - **Error tracking** — capture and aggregate runtime JS errors and unhandled rejections with stack traces (source-mapped), breadcrumbs, and affected-user counts (Sentry, etc.).
  - **Session replay** — reconstruct what the user saw/did leading to an error or drop-off.
  - **Custom events / product analytics** — track feature usage and funnels.
  - **Logging/tracing** — client logs and propagating trace context into backend traces for end-to-end visibility.

```mermaid
flowchart LR
    U[Real users' browsers] -->|"Web Vitals, errors,<br/>events, replays"| COLL[RUM / error / analytics SDK]
    COLL --> DASH[Dashboards + alerts]
    DASH --> ACT[Diagnose & fix regressions]
```

## Problem It Solves

- **Lab metrics lie** — performance on a developer's fast machine differs wildly from a mid-range phone on 4G; RUM reveals the **real** user experience and where it's bad (which devices, regions, pages).
- **Catches errors users hit but don't report** — error tracking surfaces production bugs (with stack traces and frequency) so you fix what's actually breaking, not what you guessed.
- **Connects performance/errors to business** — segment by route/cohort to see where slowness or errors cost conversions, prioritizing fixes by impact.
- Enables **regression detection** — alert when a deploy worsens Web Vitals or spikes errors.

## Trade-offs

- **RUM (field) vs. synthetic (lab)** — RUM reflects reality but is noisy and lagging (needs traffic to be statistically meaningful) and can't test pre-launch; synthetic is reproducible and works pre-release but is artificial. Use **both**: synthetic in CI to catch regressions early, RUM to know real impact.
- **Data volume & cost** — collecting metrics/errors/replays from every user is expensive and privacy-sensitive; **sample** (e.g., session replay for a fraction of sessions) and aggregate.
- **Privacy** — RUM and especially session replay can capture PII; must mask sensitive fields and comply with privacy law (consent, redaction).
- **Performance of the monitoring itself** — observability SDKs add JS weight and network calls; keep them lightweight and async so the tooling doesn't degrade the experience it measures.
- **Noise vs. signal** — too many alerts (every transient error) cause fatigue; alert on rates/thresholds and new regressions, not every event.

## Examples

- **Web Vitals RUM**
  - The `web-vitals` library reports LCP/INP/CLS from real sessions to an analytics endpoint; a dashboard shows p75 by route and device, revealing that LCP is bad specifically on mobile product pages.
- **Source-mapped errors**
  - Sentry captures a production exception with a readable (source-mapped) stack trace, breadcrumbs, the affected user count, and the release that introduced it — enabling a fast fix.
- **Regression alert**
  - A deploy raises INP on the checkout page above threshold; an alert fires and the team rolls back or fixes before it tanks conversions.
- **Session replay for a bug**
  - A hard-to-reproduce checkout error is diagnosed by replaying the user's session to see the exact sequence of actions and state.
- **Interview framing**
  - For frontend reliability/performance in production, propose RUM for field Web Vitals (segmented by device/geo), error tracking with source maps, sampled session replay, and regression alerts on deploys — combined with synthetic monitoring in CI. Stressing that **lab ≠ field** and that you optimize for real-user data is the senior insight; backend-only observability misses the client entirely.
