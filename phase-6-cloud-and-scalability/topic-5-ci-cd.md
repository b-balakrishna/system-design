# CI/CD

## Concept

- **CI/CD** automates the path from a code change to running in production, in two linked stages:
  - **Continuous Integration (CI)**: every commit is automatically built and tested (lint, unit/integration tests, security scans) so problems are caught early and `main` always stays releasable. Developers integrate frequently into a shared branch.
  - **Continuous Delivery/Deployment (CD)**: changes that pass CI are automatically prepared for release (Delivery) or pushed all the way to production (Deployment), via a repeatable pipeline.
- A typical pipeline: **commit → build → test → security scan → package (artifact/image) → deploy to staging → integration/E2E tests → deploy to prod (progressively)**.
- The principles: **automate everything, fail fast, keep `main` deployable, make deploys small and frequent, and make rollback easy.**

```mermaid
flowchart LR
    COMMIT[Commit] --> BUILD[Build]
    BUILD --> TEST[Test + scan]
    TEST --> PKG[Package image/artifact]
    PKG --> STG[Deploy staging + E2E]
    STG --> PROD[Deploy prod - progressive]
    PROD -.->|on failure| RB[Rollback]
```

## Problem It Solves

- **Fast, safe, frequent releases**: automation removes manual, error-prone deploy steps; small frequent deploys are lower-risk and easier to debug than big-bang releases.
- **Early defect detection**: CI catches bugs at commit time, not in production, shrinking the feedback loop.
- **Consistency & repeatability**: every change goes through the same gates; "it worked when I deployed it by hand" disappears.
- **Velocity with confidence**: teams ship many times a day because the pipeline enforces quality and rollback is cheap (DORA metrics: deploy frequency, lead time, change-fail rate, MTTR).

## Trade-offs

- **Pipeline speed vs. thoroughness**: more gates (E2E, security, performance) catch more but slow feedback; parallelize, cache, and run only affected tests to keep pipelines fast.
- **Continuous Delivery vs. Deployment**: auto-deploying every passing change to prod (Deployment) maximizes speed but needs strong tests, monitoring, and progressive rollout; Delivery (auto to staging, manual prod gate) is safer for high-risk systems. Choose per risk tolerance.
- **Flaky tests erode trust**: an unreliable pipeline gets ignored/bypassed; flakiness must be treated as a bug.
- **Build/test infra cost**: fast pipelines need compute (parallel runners, caches); a cost worth paying but real.
- **Security in the pipeline**: the pipeline has prod access and handles secrets; it's a high-value attack target (supply-chain security) and must be hardened.

## Examples

- **Standard pipeline**
  - GitHub Actions/GitLab CI: on PR, run lint + tests + build; on merge to `main`, build a Docker image, deploy to staging, run E2E, then deploy to prod behind a canary (topic 25) with monitoring.
- **Progressive rollout integration**
  - CD deploys to a canary, watches SLOs/error rates (topics 21, 12), and auto-promotes or auto-rolls-back based on health.
- **GitOps CD**
  - Merging a manifest change triggers ArgoCD to reconcile the cluster (topic 2) - Git is the deploy trigger and audit trail.
- **DORA-driven improvement**
  - A team tracks lead time and change-fail rate, then invests in faster tests and trunk-based development to ship more safely.
- **Interview framing**
  - For "how do you ship changes," describe an automated CI/CD pipeline: build → test → scan → package → staged deploy → progressive prod rollout with monitoring and easy rollback. Distinguishing Delivery vs. Deployment by risk, and citing DORA metrics, shows you treat the pipeline as a product capability, not a script.
