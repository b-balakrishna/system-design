# System Design Roadmap: Architectural Review & Completion Plan

> Reviewer brief: Principal Architect / Staff Engineer / System Design Interviewer.
> Scope: full review of structure, sequencing, prerequisites, gaps, and Staff+ readiness, benchmarked against DDIA, the System Design Interview Handbook, Grokking, Frontend System Design, Staff+ expectations, production-readiness standards, modern cloud, and 2026 AI/ML system design.
> Method: every topic file was read. Recommendations include a technical justification and a learning rationale. No topic is added merely to inflate count.

---

## 0. Executive Summary

This is, structurally, one of the strongest self-paced system design curricula I have reviewed. The nine-phase arc - **interview framing → low-level design → foundations → backend → distributed systems → frontend → cloud → AI/ML → case studies** - is pedagogically correct: it moves from communication skills, to single-process object design, to single-machine foundations, to multi-machine hard problems, and finally to applied case studies. Few public roadmaps treat frontend and AI/ML as first-class design surfaces; this one does.

There are two findings that dominate everything else:

1. **Content completeness.** Only Phases 0, 1, and 2 are written (33 of 138 topic files, ~50,000 words of genuinely high-quality material). **All 105 files in Phases 3 through 8 are empty (0 bytes).** The roadmap is a fully-scaffolded *skeleton* with three excellent phases attached. "Completing" the roadmap is therefore primarily a content-authoring effort, not a restructuring one.

2. **Curriculum ceiling.** The *titles* that exist target a strong **Senior** engineer. They do **not** yet reach **Staff/Principal**. The gaps are systematic and fall into seven clusters: (a) data modeling and storage-engine internals, (b) messaging reliability (outbox, DLQ, delivery semantics), (c) backend architecture discipline (DDD, hexagonal, multi-tenancy, BFF), (d) reliability engineering (SLO/SLI/error budgets, chaos, load testing, autoscaling), (e) security as a discipline (threat modeling, OWASP, zero trust, supply chain), (f) data engineering (lakes, warehouses, ETL/ELT, CDC, governance), and (g) the entire Staff+ layer (ADRs, build-vs-buy, Conway's Law, team topologies, evolutionary architecture). The 2024-era AI/ML phase also needs its 2026 agentic additions (evals, feature/model registries, tool-calling, MCP, semantic caching, memory).

The quality bar set by Phases 0-2 is high and should be the template for everything that follows: a `## Concept` opener, at least one Mermaid diagram, a `## Problem It Solves` section, an explicit `## Trade-offs` section, worked `## Examples`, and - for systems topics - a decision framework / quick-reference table.

**Verdict at a glance:**

| Track | Skeleton quality | Content state | Reaches |
| - | - | - | - |
| Interview readiness (Phases 0, 8) | Excellent | 0 written / 8 placeholders | Senior |
| Foundations + Backend (2, 3) | Strong, gaps in data modeling | 2 written, 3 empty | Senior (Staff with additions) |
| Distributed systems (4) | Strong theory, weak on messaging reliability & resilience patterns | Empty | Senior+ |
| Frontend (5) | Very strong, missing data-fetching & observability | Empty | Senior+ |
| Cloud (6) | Good, missing reliability + security depth | Empty | Senior |
| AI/ML (7) | Good 2024 baseline, missing 2026 agentic layer | Empty | Senior |
| Staff+ leadership | **Absent** | - | - |

---

## 1. Roadmap Review: Phase by Phase

### Phase 0: Interview Primer (8 topics, written, excellent)

The strongest single phase. The 6-step framework, capacity estimation, latency numbers, and the scaling-a-design progression are exactly the right opening, and the writing is tight and interview-calibrated. Sequencing is correct: framework → requirements → estimation → latency anchors → API → diagrams → trade-offs → scaling.

- **Ordering:** correct. Estimation (3) depends on requirements (2); both feed scaling (8). No changes.
- **Gap:** there is no topic on **non-functional requirements as SLAs/percentiles** beyond the brief mention in topic 2 - specifically p50/p95/p99 reasoning, which interviewers probe constantly. Recommend folding a "tail latency & percentiles" subsection into topic 4 (Latency Numbers) rather than a new topic.
- **Minor:** topic 7 (Trade-Off Communication) is about *interview* communication. The *architectural* discipline of trade-off analysis (weighted decision matrices, reversible vs irreversible decisions) belongs in the new Staff+ phase - keep them distinct and cross-link.

### Phase 1: Low-Level Design (6 topics, written, excellent)

SOLID → creational → structural → behavioral → UML → case studies is the canonical LLD sequence and is executed well. The 9 case studies (parking lot, vending machine, elevator, document editor, tic-tac-toe, ATM, library, BookMyShow, chess) are the exact set interviewers ask, and the "pattern signals" lookup table is a standout.

- **Ordering:** correct. UML (5) arguably should come *before* the pattern topics so learners can read the diagrams in 2-4, but the current order is defensible because the patterns motivate the notation. Leave as-is; add a one-line forward-reference in topic 2.
- **Gap:** **concurrency in LLD** - thread-safety of the design objects (e.g., the parking-lot `occupy()` race already hinted at in the text) - is missing. Most Staff-level LLD rounds add "now make it thread-safe." This is partly served by Phase 3's Concurrency topic, but a short LLD-level treatment (locks on shared mutable entities, optimistic vs pessimistic) would close a real interview gap. Recommend a new topic 7: **Concurrency in Low-Level Design**.

### Phase 2: Foundations (19 topics, written, very strong)

Comprehensive and well-written; the caching and SQL-vs-NoSQL topics in particular are deeper than most paid courses. Sequencing (client-server → HTTP → HTTP/2-3 → DNS → CDN → OSI → browser → realtime → REST/GraphQL/gRPC → auth cluster → versioning → caching → rate limiting → DB fundamentals → SQL-vs-NoSQL) is sound.

- **Ordering issue:** **OSI Model & Networking (6)** sits *after* HTTP, HTTP/2/3, DNS, and CDN, which all depend on the layered model it teaches. The OSI/TCP/UDP foundation should come *before* the HTTP topics. **Recommend moving topic 6 → position 2** (right after client-server).
- **Critical gap - Data Modeling & Schema Design.** The phase jumps from "Database Fundamentals" straight to "SQL vs NoSQL" with no topic on **how to model data**: entities, relationships, normalization vs denormalization, access-pattern-driven modeling, and single-table design. This is the single most common weakness in mid-level system design answers and a foundational prerequisite for everything in Phase 3. **Highest-priority addition in the whole roadmap.**
- **Minor gap:** TLS handshake depth lives implicitly inside HTTP/HTTPS (2); it is sufficient for now.

### Phase 3: Backend (25 topics, **empty**)

The planned title set is strong and broad (architectures → proxies/LB/gateway → resilience → database internals/indexing/isolation/migrations/replication/sharding → locking/IDs/Redis → queues → idempotency → search/storage → concurrency). But several issues are visible from the structure alone:

- **Misplaced foundational topic:** **Concurrency & Thread Models (25)** is at the very end, yet it underpins Connection Pooling (15), Distributed Locking (16), and Redis (18). **Move it to ~position 8**, before the database cluster.
- **Storage-engine depth is implicit, not explicit.** "Database Internals (9)" is a single topic expected to carry B-Trees, LSM-Trees, WAL, MVCC, and the buffer pool. That is too much for one file and too important to bury. **Split** into Database Internals (storage layout, WAL, MVCC, buffer pool) and a dedicated **Storage Engines: B-Trees vs LSM-Trees** topic - the read/write-amplification trade-off is a recurring Staff interview question.
- **Query optimization is missing.** Indexing (10) covers index *structures* but not **query planning / EXPLAIN / execution plans / N+1**. Add as a topic adjacent to indexing.
- **Partitioning nuance is missing.** Sharding (14) covers the mechanics; **hot partitions, partition-key selection, and secondary-index fan-out** deserve explicit treatment. Fold a "Partitioning Strategies & Hot Partitions" topic in beside sharding, or expand sharding to cover them explicitly.
- **Messaging reliability cluster is absent.** Queues (19), task queues (20), and broker-vs-streaming (21) are present, but the *reliability* patterns that make them production-safe are not: **Outbox/Inbox pattern, Dead Letter Queues, retry strategies with backoff+jitter, and exactly-once vs at-least-once delivery semantics.** This is a glaring gap given idempotency (22) is already here to pair with it.
- **Backend architecture discipline is thin.** Monolith/modular-monolith/microservices/service-mesh cover *deployment topology* but not *design discipline*: **Domain-Driven Design, Clean/Hexagonal Architecture, Multi-Tenant Architecture, Backend-for-Frontend (BFF), and Choreography vs Orchestration.** These are core Staff+ vocabulary.
- **Orphan relocation in:** Time-Series Databases and Geospatial Indexing (currently Phase 6) are *data/storage* topics, not cloud topics - they belong in this phase's data cluster.

### Phase 4: Distributed Systems (22 topics, **empty**)

Excellent theory coverage (CAP, PACELC, consistency models, clocks, gossip, failure detection, consensus, leader election, consistent hashing) plus the probabilistic-structures cluster (Bloom, Count-Min, HyperLogLog). The gaps are on the *applied resilience* side.

- **Prerequisite-ordering note:** **Consistent Hashing (18)** is a prerequisite for **Sharding (Phase 3, topic 14)** and Distributed Caching (22). Learners hit sharding ~30 topics before the technique that makes it work. Either move a consistent-hashing primer earlier or add an explicit forward/back cross-reference. Recommend cross-reference (moving it breaks the clean theory grouping).
- **Misplaced topic:** **Distributed Caching (22)** is an applied backend/cloud concern, not core distributed-systems theory, and it duplicates surface area with Caching Basics (2.16) and Redis (3.18). **Relocate to Phase 3** and frame it as "scaling the cache tier."
- **Resilience-pattern gaps:** the phase has Backpressure (8) and (via Phase 3) Circuit Breaker, but is missing the rest of the production resilience toolkit: **Bulkheads, Request Hedging, Retry Storms & Jitter, Failure Domains, and Cell-Based Architecture.** These are exactly the patterns that separate Senior from Staff in a reliability discussion.
- **Event/stream gaps:** Event Sourcing (10) and CQRS (9) are here, but **Event-Driven Architecture (the umbrella), Stream Processing (Flink/Kafka Streams), Change Data Capture (CDC), and Kafka internals** are missing. CDC in particular ties the outbox pattern, event sourcing, and data engineering together.
- **Distributed coordination gaps:** **Distributed Rate Limiting** (the distributed version of 2.17) and **Distributed Scheduling** (the engine behind case study 8.13) are missing as concept topics.

### Phase 5: Frontend (25 topics, **empty**)

The best frontend system-design syllabus in any public roadmap I have seen: rendering pipeline, CRP, the CSR/SSR/SSG/ISR spectrum, streaming SSR + partial hydration, state, performance, micro-frontends, a11y at scale. Ordering is correct (browser internals → rendering strategies → app architecture → performance → resilience/testing → design systems).

- **Notable omission - the data layer.** There is no topic on **client-side data fetching & caching** (React Query / SWR / Apollo, request deduplication, cache invalidation, optimistic updates). This is arguably the #1 architectural concern in modern frontend apps and a guaranteed Staff frontend interview topic. **High-priority addition.**
- **Observability gap:** **Frontend Observability & Real User Monitoring (RUM)** - Core Web Vitals in the field, error tracking, session replay, performance budgets in CI - is missing. Backend observability is covered in Phase 6; the frontend equivalent is not.
- **Operational gap:** **Frontend CI/CD & deployment** (preview deploys, atomic asset deploys, cache-busting, progressive rollout of bundles) is missing.
- **Architecture gap:** **React Architecture at Scale** (server components, component boundaries, rendering strategy selection at the app level) is partly served by topic 6 but deserves a dedicated treatment given the 2026 RSC landscape.
- **Adequately covered (no new topic needed):** offline-first (served by PWA + service workers), design tokens (served by design systems), edge rendering (served by streaming SSR + Phase 6 edge computing) - cross-reference rather than duplicate.

### Phase 6: Cloud & Scalability (20 topics, **empty**)

Solid production-readiness coverage (Docker, K8s, serverless, edge, CI/CD, feature flags, IaC, AWS, networking, HA, DR, observability, logging/metrics/tracing). But the phase is doing too many jobs and is missing the reliability-engineering and security disciplines.

- **Reliability-engineering gaps (the SRE layer):** **SLOs/SLIs/Error Budgets, Chaos Engineering, Load Testing, Capacity Planning, and Autoscaling Strategies** are all missing. "Testing Distributed Systems (14)" gestures at chaos but is not a substitute. For a roadmap claiming production-engineering readiness, the absence of SLO/error-budget thinking is the most conspicuous gap.
- **Deployment-strategy gaps:** **Blue-Green and Canary** are folded implicitly into "Feature Flags & Progressive Delivery (6)." They each deserve explicit treatment - they are distinct mechanisms with distinct rollback semantics.
- **Platform gap:** **Platform Engineering / Internal Developer Platforms** and **Secrets Management** are missing - both are now standard Staff+ expectations.
- **Security is under-served.** "Security Architecture (18)" is a single topic carrying an entire discipline. Security should be its own cluster (see Phase 8 recommendation): **Threat Modeling, OWASP Top 10, API Security, Zero Trust, Identity Federation, Secrets Rotation, Supply Chain Security, Security Monitoring.**
- **Orphan relocation out:** Time-Series Databases (15), Geospatial Indexing (16) → Phase 3 (data). Data Pipelines (17) → new Data Engineering phase.

### Phase 7: AI & ML Systems (15 topics, **empty**)

A strong 2024-era baseline (ML overview, data pipelines, training/fine-tuning infra, serving, LLM inference, RAG, vector DBs, prompt engineering, agents, guardrails, feedback loops, A/B testing, observability, cost/latency). For a roadmap dated to **2026**, it is missing the agentic-systems layer that now dominates AI system design interviews.

- **Evaluation gap (most important):** there is no **Evaluation Pipelines / LLM-as-judge / offline+online evals** topic. A/B testing models (13) is online experimentation, not eval harness design. Evals are now the central artifact of production LLM systems.
- **MLOps-registry gaps:** **Feature Stores, Model Registry, and Model Versioning** are missing - the backbone of reproducible ML.
- **Agentic gaps:** **Tool-Calling Architecture, MCP (Model Context Protocol) architecture, Multi-Agent Systems, and Agent Memory / Long-Term Memory** are missing; "AI Agent Architecture (10)" is a single topic standing in for all of them.
- **Retrieval gaps:** **Embedding Pipelines** and **Vector Search Architecture** (ANN index internals - HNSW, IVF, product quantization) deserve separate treatment from "Vector Databases (8)," which currently has to carry both.
- **Efficiency gap:** **Semantic / LLM caching** (prompt and embedding caches, KV-cache reuse) is missing; cost/latency (15) covers the economics but not the caching mechanism.
- **Safety gap:** **Hallucination Mitigation** and broader **AI Safety** are partly served by Guardrails (11) but warrant explicit coverage given their interview weight.

### Phase 8: Case Studies (17 topics, **empty**)

An excellent, well-chosen set spanning read-heavy (URL shortener, Twitter feed, autocomplete), realtime (chat, Google Docs), media (YouTube), transactional (e-commerce, payments), infra (job scheduler, CI/CD, rate limiter), and modern (LLM-powered search, React component library). The mix of backend, frontend, and AI case studies is a real strength.

- **Coverage gaps in the case set:** there is no **proximity/geo case study** (Yelp / "nearby places" / Uber dispatch beyond ride-sharing), no **distributed key-value store / database design** case (a classic Staff prompt), no **metrics/monitoring system** case (pairs with Phase 6), and no **multi-tenant SaaS** case. Recommend adding 2-3 of these.
- **Sequencing:** order the case studies by difficulty and by which phases they exercise; add a per-case "prerequisite topics" header so each case study explicitly closes the loop back to the concept phases.
- **Format recommendation:** each case study should follow Phase 0's 6-step framework verbatim (requirements → estimation → API → data model → high-level → deep-dive/scale) so the primer and the case studies reinforce each other.

---

## 2. Missing Topics Report (Prioritized)

Priority key: **P0** = foundational prerequisite or universally-asked, fixes a real learning gap; **P1** = strongly expected at Senior/Staff; **P2** = depth/differentiation for Staff+.

### Data Layer

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | Data Modeling & Schema Design | Foundational prerequisite for all of Phase 3; the most common weakness in real answers. Normalization, denormalization, access-pattern-driven modeling, single-table design. | Phase 2, after DB Fundamentals |
| P0 | Storage Engines: B-Trees vs LSM-Trees | Read/write amplification trade-off is a recurring Staff question; currently buried in "DB Internals." | Phase 3, beside DB Internals |
| P1 | Query Optimization & Execution Plans | Indexing covers structures, not planning. EXPLAIN, N+1, join strategies. | Phase 3, after Indexing |
| P1 | Partitioning Strategies & Hot Partitions | Sharding covers mechanics; key selection and hot-partition mitigation are the hard parts. | Phase 3, beside Sharding |
| P2 | Secondary Indexes (local vs global) | Fan-out cost and consistency of secondary indexes in partitioned stores. | Phase 3, after Indexing |
| P2 | Data Lifecycle & Archival | Retention, tiering (hot/warm/cold), TTL, GDPR deletion. Production reality rarely taught. | Phase 3, end of data cluster |

### Distributed Systems & Messaging Reliability

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | Outbox / Inbox Pattern | The canonical solution to dual-write atomicity; pairs with idempotency and CDC. | Phase 3, after Idempotency |
| P0 | Dead Letter Queues & Retry Strategies | Backoff + jitter, poison messages, redrive. Production-critical, currently absent. | Phase 3, after Message Queues |
| P1 | Exactly-Once vs At-Least-Once Delivery | Delivery-semantics reasoning is a guaranteed messaging interview question. | Phase 3 or 4, with messaging |
| P1 | Event-Driven Architecture (umbrella) | Ties together queues, streaming, event sourcing, CQRS under one design model. | Phase 4, before Event Sourcing |
| P1 | Change Data Capture (CDC) | Connects outbox, event sourcing, and data pipelines; Debezium-style log tailing. | Phase 4 or Data Eng |
| P1 | Stream Processing | Windowing, watermarks, Flink/Kafka Streams; the compute side of streaming. | Phase 4 / Data Eng |
| P1 | Distributed Rate Limiting | The distributed version of the existing 2.17; token-bucket across nodes. | Phase 4 |
| P2 | Bulkheads | Failure isolation; resource pool partitioning. | Phase 4, with resilience |
| P2 | Request Hedging | Tail-latency mitigation via speculative duplicate requests. | Phase 4, with resilience |
| P2 | Retry Storms & Failure Domains | Why naive retries cause cascading failure; blast-radius reasoning. | Phase 4, with resilience |
| P2 | Cell-Based Architecture | Modern blast-radius containment (AWS/Slack-style cells). | Phase 4 or Cloud |
| P2 | Distributed Scheduling | The engine behind the job-scheduler case study. | Phase 4 |
| P2 | Kafka Internals | Partitions, ISR, consumer groups, log compaction. | Phase 4 / Data Eng |

### Backend Architecture

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P1 | Domain-Driven Design (DDD) | Bounded contexts and aggregates drive service boundaries; core Staff vocabulary. | Phase 3, with architecture |
| P1 | Clean / Hexagonal Architecture | Ports-and-adapters / dependency rule; testability and decoupling. | Phase 3, with architecture |
| P1 | Multi-Tenant Architecture | Tenancy isolation models (silo/pool/bridge); near-universal in SaaS interviews. | Phase 3 |
| P1 | Backend-for-Frontend (BFF) | API composition per client; bridges Phases 3 and 5. | Phase 3 |
| P2 | Choreography vs Orchestration | Workflow design axis; extends the Saga topic. | Phase 3/4, after Saga |

### Frontend

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | Client Data Fetching & Caching | React Query/SWR, dedup, optimistic updates, invalidation. The #1 modern FE architecture concern; currently absent. | Phase 5, after State Management |
| P1 | Frontend Observability & RUM | Core Web Vitals in the field, error tracking, session replay, perf budgets. | Phase 5, after Performance |
| P1 | Frontend CI/CD & Deployment | Preview deploys, atomic asset deploys, cache-busting, bundle rollout. | Phase 5, end |
| P2 | React Architecture at Scale (RSC era) | Server components, rendering-strategy selection at app level. | Phase 5, after Architecture Patterns |

### Cloud, Reliability & Delivery

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | SLOs, SLIs & Error Budgets | The vocabulary of production reliability; conspicuously absent. | Phase 6, early |
| P1 | Chaos Engineering | Fault injection, game days; verifies the resilience patterns from Phase 4. | Phase 6 |
| P1 | Load & Stress Testing | Capacity validation; pairs with capacity planning and autoscaling. | Phase 6 |
| P1 | Autoscaling Strategies | HPA/VPA, predictive vs reactive, scale-to-zero. | Phase 6 |
| P1 | Deployment Strategies: Blue-Green & Canary | Distinct rollback semantics; currently implicit in feature flags. | Phase 6, with CI/CD |
| P1 | Secrets Management | Vault/KMS, rotation, dynamic secrets. | Phase 6, with security |
| P2 | Capacity Planning (production) | Headroom, growth modeling; extends Phase 0 estimation to ops. | Phase 6 |
| P2 | Platform Engineering & IDPs | Golden paths, self-service infra; Staff+ org-level concern. | Phase 6 or Staff+ |

### Security (warrants a dedicated cluster/phase)

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | Threat Modeling | STRIDE/attack trees; how security design is actually done. | New Security phase |
| P0 | OWASP Top 10 & API Security | Baseline application security literacy; injection, auth, SSRF, rate-limit abuse. | New Security phase |
| P1 | Zero Trust Architecture | Modern perimeter-less model; mTLS, identity-aware proxies. | New Security phase |
| P1 | Identity Federation | SAML/OIDC federation, SSO at scale; extends the auth cluster. | New Security phase |
| P2 | Secrets Rotation | Operational key lifecycle; pairs with secrets management. | New Security phase |
| P2 | Supply Chain Security | SBOM, dependency/signing (SLSA, Sigstore); rising interview topic. | New Security phase |
| P2 | Security Monitoring & Detection | SIEM, audit logging, anomaly detection. | New Security phase |

### Data Engineering (warrants a dedicated phase)

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P1 | Batch Processing | MapReduce/Spark model; foundational data-eng compute. | New Data Eng phase |
| P1 | Data Warehouses vs Data Lakes (+ Lakehouse) | OLAP storage models; columnar, Snowflake/BigQuery/Iceberg. | New Data Eng phase |
| P1 | ETL vs ELT | Pipeline design axis; modern ELT shift. | New Data Eng phase |
| P2 | Data Governance & Quality | Lineage, catalogs, contracts, PII handling. | New Data Eng phase |
| - | (Stream Processing, CDC, Kafka Internals) | Listed under Distributed; co-locate here if a Data Eng phase is created. | New Data Eng phase |

### AI / ML Systems (2026 agentic layer)

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | Evaluation Pipelines (offline + online, LLM-as-judge) | The central artifact of production LLM systems; currently absent. | Phase 7, after Guardrails |
| P1 | Feature Stores | Online/offline parity; backbone of reproducible ML. | Phase 7, with data pipelines |
| P1 | Model Registry & Versioning | Lineage, promotion, rollback of models. | Phase 7, with serving |
| P1 | Tool-Calling Architecture | Function calling, schemas, validation, error handling. | Phase 7, with Agents |
| P1 | Agent Memory & Long-Term Memory | Short/long-term memory, summarization, retrieval-backed memory. | Phase 7, with Agents |
| P1 | Embedding Pipelines & Vector Search Architecture | Chunking, embedding refresh, ANN index internals (HNSW/IVF/PQ). | Phase 7, with RAG/Vector DBs |
| P2 | MCP (Model Context Protocol) Architecture | Standardized tool/context interface; rising 2026 standard. | Phase 7, with Agents |
| P2 | Multi-Agent Systems | Orchestration, role specialization, handoffs. | Phase 7, with Agents |
| P2 | Semantic / LLM Caching | Prompt/embedding cache, KV-cache reuse; cost + latency lever. | Phase 7, with cost/latency |
| P2 | Context Engineering | Context window budgeting, retrieval packing, compaction. | Phase 7, with prompt eng |
| P2 | Hallucination Mitigation & AI Safety | Grounding, citations, refusal; high interview weight. | Phase 7, with Guardrails |

### Staff+ Engineering & Architecture Leadership (entirely absent: highest structural priority)

| Priority | Topic | Why Needed | Suggested Position |
| - | - | - | - |
| P0 | Architecture Decision Records (ADRs) | How senior decisions are documented and defended. | New Staff+ phase |
| P0 | Engineering Trade-Off Analysis | Weighted matrices, reversible vs one-way-door decisions. | New Staff+ phase |
| P1 | Build vs Buy Decisions | TCO, opportunity cost, strategic differentiation. | New Staff+ phase |
| P1 | Conway's Law & Team Topologies | Org structure ↔ architecture; the defining Staff+ insight. | New Staff+ phase |
| P1 | System Decomposition | Service boundaries from first principles; pairs with DDD. | New Staff+ phase |
| P1 | Evolutionary Architecture | Fitness functions, strangler fig, incremental migration. | New Staff+ phase |
| P2 | Technical Strategy & Roadmapping | Multi-quarter technical direction, tech-debt strategy. | New Staff+ phase |
| P2 | Organizational Scaling | Scaling teams, ownership models, platform vs product. | New Staff+ phase |

---

## 3. Reordering, Splits & Merges

### Reordering Suggestions

| Current Position | New Position | Reason |
| - | - | - |
| Phase 2 → OSI Model & Networking (6) | Phase 2, position 2 | The layered model is a prerequisite for HTTP, HTTP/2/3, DNS, CDN, which currently precede it. |
| Phase 3 → Concurrency & Thread Models (25) | Phase 3, ~position 8 | Underpins connection pooling, distributed locking, and Redis, all of which currently precede it. |
| Phase 4 → Distributed Caching (22) | Phase 3 (backend data cluster) | It is an applied caching/scaling topic, not core distributed theory; co-locate with Redis and Caching Basics. |
| Phase 6 → Time-Series DBs (15), Geospatial Indexing (16) | Phase 3 (data cluster) | They are data/storage topics, not cloud topics. |
| Phase 6 → Data Pipelines (17) | New Data Engineering phase | Anchors the data-engineering cluster. |
| Phase 4 → Consistent Hashing (18) | Keep, add cross-reference from Phase 3 Sharding | Prerequisite for sharding (30 topics earlier); cross-link rather than relocate to preserve theory grouping. |

### Topics To Split

| Topic | Suggested New Topics | Reason |
| - | - | - |
| Phase 3 - Database Internals (9) | (a) Database Internals (WAL, MVCC, buffer pool); (b) Storage Engines: B-Trees vs LSM-Trees | One file cannot carry both the engine internals and the B-Tree/LSM trade-off, which is itself a full interview topic. |
| Phase 6 - Feature Flags & Progressive Delivery (6) | (a) Feature Flags; (b) Deployment Strategies: Blue-Green & Canary | Flags and rollout strategies are distinct mechanisms with distinct rollback semantics. |
| Phase 6 - Security Architecture (18) | An entire Security phase (see §2) | A single topic cannot carry threat modeling, OWASP, zero trust, federation, supply chain, and monitoring. |
| Phase 7 - AI Agent Architecture (10) | (a) Agent Architecture; (b) Tool-Calling; (c) Agent Memory; (d) Multi-Agent / MCP | Agentic systems are now four+ distinct design surfaces, not one. |
| Phase 7 - Vector Databases (8) | (a) Vector Databases; (b) Embedding Pipelines & Vector Search Architecture | Storage vs the embedding/ANN-index pipeline are separable concerns. |

### Topics To Merge

| Topics | Reason |
| - | - |
| Phase 3 Idempotency (22) + Phase 4 Idempotency in Distributed Systems (13) | Significant overlap. Keep one foundational topic in Phase 3 and have Phase 4 reference it for the *distributed* nuances (dedup stores, idempotency keys across services) rather than restating fundamentals. |
| Phase 6 Observability (12) + Logging/Metrics/Tracing (13) | Heavy overlap. Make 12 the conceptual umbrella (the three pillars, cardinality, sampling) and 13 the hands-on implementation, with no duplicated content - or merge into one richer topic. |
| Phase 5 Code Splitting (8) + Lazy Loading (9) | Closely related; could be one topic ("Code Splitting & Lazy Loading") unless each is kept deliberately short. Lower priority - defensible to keep separate. |

---

## 4. Final Recommended Roadmap

The recommended structure keeps the existing nine phases, fixes the placements above, integrates the prioritized additions, and adds **three new phases** (Data Engineering, Security, Staff+). New (`+`) and relocated (`→`) items are marked. This is a curriculum for **Senior → Staff → Principal**, not just interview prep.

```
Phase 0  -  Interview Primer (8 → 8)
  1 The 6-Step Framework
  2 Functional vs Non-Functional Requirements
  3 Capacity Estimation
  4 Latency Numbers (+ tail latency / p50-p95-p99 subsection)
  5 API Design in Interviews
  6 Drawing System Diagrams
  7 Trade-Off Communication
  8 Scaling a Design

Phase 1  -  Low-Level Design (6 → 7)
  1 SOLID Principles
  2 Design Patterns: Creational
  3 Design Patterns: Structural
  4 Design Patterns: Behavioral
  5 UML and Class Diagrams
  6 LLD Case Studies
  7 + Concurrency in Low-Level Design

Phase 2  -  Foundations (19 → 21)
  1 Client-Server Architecture
  2 → OSI Model & Networking (moved up)
  3 HTTP and HTTPS
  4 HTTP/2 and HTTP/3 (QUIC)
  5 DNS
  6 CDN
  7 Browser Architecture
  8 WebSockets and Long Polling
  9 REST APIs
  10 GraphQL
  11 gRPC and Protocol Buffers
  12 Authentication vs Authorization
  13 OAuth 2.0 and OpenID Connect
  14 Cookies, Sessions, JWT
  15 API Versioning
  16 Caching Basics
  17 Rate Limiting
  18 Database Fundamentals
  19 + Data Modeling & Schema Design        [P0]
  20 SQL vs NoSQL
  21 + Indexing Basics (or keep in Phase 3)

Phase 3  -  Backend & Data Architecture (25 → ~36)
  Architecture:  Monolith · Modular Monolith · Microservices · Service Mesh
                 + Domain-Driven Design · + Clean/Hexagonal Architecture
                 + Multi-Tenant Architecture · + Backend-for-Frontend (BFF)
  Edge/traffic:  Load Balancers · Reverse Proxy · API Gateway · Circuit Breaker
  Concurrency:   → Concurrency & Thread Models (moved up)
  Data:          Database Internals · + Storage Engines: B-Trees vs LSM-Trees
                 Indexing · + Query Optimization & Execution Plans
                 Isolation Levels · Migrations · Replication · Sharding
                 + Partitioning Strategies & Hot Partitions · + Secondary Indexes
                 → Time-Series Databases · → Geospatial Indexing
                 + Data Lifecycle & Archival
  Coordination:  Distributed Locking · Unique ID Generation · Redis
                 → Distributed Caching (moved from Phase 4)
  Messaging:     Message Queues · Task Queues · Message Broker vs Event Streaming
                 + Dead Letter Queues & Retry Strategies
                 + Outbox/Inbox Pattern · + Exactly-Once vs At-Least-Once
                 Idempotency
  Workflow:      + Choreography vs Orchestration
  Other:         Search Systems · Object Storage

Phase 4  -  Distributed Systems (22 → ~31)
  Theory:        CAP · PACELC · Consistency Models · Eventual Consistency
                 Logical & Vector Clocks
  Coordination:  Gossip · Heartbeats & Failure Detection · Consensus · Leader Election
                 Service Discovery · Consistent Hashing (cross-ref Sharding)
  Events:        + Event-Driven Architecture · CQRS · Event Sourcing
                 + Stream Processing · + Change Data Capture (CDC) · + Kafka Internals
  Transactions:  Saga · Distributed Transactions · Idempotency (ref Phase 3) · CRDTs
  Resilience:    Backpressure · + Bulkheads · + Request Hedging
                 + Retry Storms & Failure Domains · + Cell-Based Architecture
  Coordination+: + Distributed Rate Limiting · + Distributed Scheduling
  Structures:    Bloom Filters · Count-Min Sketch · HyperLogLog

Phase 5  -  Data Engineering (NEW, ~7)
  + Batch Processing · → Data Pipelines (moved from Phase 6)
  + Data Warehouses vs Data Lakes (+ Lakehouse) · + ETL vs ELT
  + Data Governance & Quality
  (cross-ref Stream Processing, CDC, Kafka Internals from Phase 4)

Phase 6  -  Frontend (25 → ~29)
  Browser/render: Rendering Pipeline · Critical Rendering Path
                  CSR/SSR/SSG/ISR · Streaming SSR & Partial Hydration · Virtual DOM
  Architecture:   Frontend Architecture Patterns · + React Architecture at Scale (RSC)
                  State Management · + Client Data Fetching & Caching   [P0]
  Performance:    Code Splitting · Lazy Loading · Image Optimization
                  Font Loading · Web/Service Workers · Browser Storage · Frontend Performance
  Realtime:       WebSockets (FE) · SSE (FE)
  Quality/ops:    Frontend Security · Bundlers · Monorepo · PWA · Micro Frontends
                  Error Boundaries · Testing Strategy · Design Systems · a11y at Scale
                  + Frontend Observability & RUM · + Frontend CI/CD & Deployment

Phase 7  -  Cloud, Reliability & Delivery (20 → ~26)
  Compute:        Docker · Kubernetes · Serverless · Edge Computing
  Delivery:       CI/CD · Feature Flags · + Blue-Green & Canary · IaC
  Cloud:          AWS Fundamentals · Cloud Networking
  Reliability:    High Availability · Disaster Recovery
                  + SLOs, SLIs & Error Budgets · + Chaos Engineering
                  + Load & Stress Testing · + Autoscaling · + Capacity Planning
  Observability:  Observability (umbrella) · Logging/Metrics/Tracing
  Platform:       + Platform Engineering & IDPs · + Secrets Management
  Other:          Testing Distributed Systems · Cost Optimization · Multi-Region Design

Phase 8  -  Security (NEW, ~7)
  + Threat Modeling · + OWASP Top 10 & API Security · + Zero Trust Architecture
  + Identity Federation · + Secrets Rotation · + Supply Chain Security
  + Security Monitoring & Detection
  (Security Architecture from old Phase 6 becomes this phase's overview)

Phase 9  -  AI & ML Systems (15 → ~26)
  Foundations:  ML System Design Overview · Data Pipelines for ML · + Feature Stores
  Training:     Model Training Infra · Fine-Tuning Infra
  Serving:      Model Serving & Inference · + Model Registry & Versioning
                LLM Inference Architecture · + Semantic / LLM Caching
  Retrieval:    RAG · Vector Databases · + Embedding Pipelines & Vector Search Arch
  LLM eng:      Prompt Engineering at Scale · + Context Engineering
  Agents:       AI Agent Architecture · + Tool-Calling Architecture
                + Agent Memory & Long-Term Memory · + Multi-Agent Systems · + MCP Architecture
  Safety/ops:   Guardrails & Moderation · + Hallucination Mitigation & AI Safety
                + Evaluation Pipelines · Feedback Loops · A/B Testing Models
                AI Observability · Cost & Latency Trade-offs

Phase 10  -  Case Studies (17 → ~20)
  (existing 17) + Design a Proximity/Nearby Service (geo)
                + Design a Distributed Key-Value Store
                + Design a Metrics & Monitoring System
  Each case study: follow the Phase 0 6-step framework + a "prerequisite topics" header.

Phase 11  -  Staff+ Engineering & Architecture Leadership (NEW, ~8)
  + Architecture Decision Records (ADRs) · + Engineering Trade-Off Analysis
  + Build vs Buy · + Conway's Law & Team Topologies · + System Decomposition
  + Evolutionary Architecture · + Technical Strategy & Roadmapping · + Organizational Scaling
```

This grows the roadmap from 138 to roughly **205 topics**. Every addition maps to a specific gap identified in §1; none are filler.

---

## 5. Top 20 Highest-Impact Additions

Ranked by how much each lifts the roadmap toward its stated goals (FAANG/Senior/Staff interviews + production engineering). Reasoning is one line each.

1. **Data Modeling & Schema Design**: the missing foundation under all of Phase 3; fixes the most common real-world weakness.
2. **SLOs, SLIs & Error Budgets**: the vocabulary of production reliability; its absence undercuts the production-engineering claim.
3. **Staff+ phase (ADRs + Trade-Off Analysis + Conway's Law)**: the single biggest *structural* gap; nothing today targets Staff/Principal.
4. **Outbox/Inbox Pattern**: the canonical dual-write solution; pairs with the already-present idempotency topic.
5. **Evaluation Pipelines (LLM evals)**: the central artifact of modern AI systems; conspicuously missing from a 2026 syllabus.
6. **Client Data Fetching & Caching (React Query/SWR)**: the #1 modern frontend architecture concern; entirely absent.
7. **Storage Engines: B-Trees vs LSM-Trees**: the read/write-amplification trade-off is a perennial Staff question.
8. **Threat Modeling + OWASP/API Security**: baseline security literacy expected at every level.
9. **Dead Letter Queues & Retry Strategies (backoff + jitter)**: production-critical messaging reliability.
10. **Domain-Driven Design**: the conceptual engine for service boundaries; core Staff vocabulary.
11. **Chaos Engineering**: the discipline that *verifies* the resilience patterns already taught.
12. **Query Optimization & Execution Plans**: turns "add an index" into actual diagnosis (EXPLAIN, N+1).
13. **Tool-Calling Architecture + Agent Memory**: the agentic core of 2026 AI system design.
14. **Change Data Capture (CDC)**: connects outbox, event sourcing, and data pipelines into one mental model.
15. **Multi-Tenant Architecture**: near-universal in SaaS interviews; isolation models are non-obvious.
16. **Frontend Observability & RUM**: closes the loop on the otherwise-excellent frontend track.
17. **Deployment Strategies: Blue-Green & Canary (split out)**: distinct rollback semantics worth explicit treatment.
18. **Data Engineering phase (Warehouses/Lakes, ETL vs ELT)**: required context for both backend scale and AI/ML.
19. **Bulkheads + Request Hedging + Cell-Based Architecture**: the resilience patterns that distinguish Staff answers.
20. **Embedding Pipelines & Vector Search Architecture**: separates ANN-index reality from "use a vector DB."

---

## 6. Staff Engineer Readiness Analysis

**As a title skeleton (assuming all files are written to the Phase 0-2 quality bar):**

### Senior Engineer: *Sufficient, once Phases 3-8 are written, with the P0/P1 data and reliability additions.*
The current title set already covers the Senior bar well: foundations, backend patterns, distributed-systems theory, frontend depth, cloud basics, and a strong case-study set. The two things a Senior candidate would still be caught out on are **data modeling** (P0) and **messaging reliability** (outbox/DLQ/delivery semantics). Add those and the Senior track is complete. Estimated readiness with additions: **strong**.

### Staff Engineer: *Not yet sufficient; reachable with the additions in §2.*
Staff interviews test three things this roadmap under-serves: (1) **reliability engineering as a discipline** - SLOs/error budgets, chaos, load testing, capacity planning, autoscaling; (2) **architecture discipline** - DDD, hexagonal, multi-tenancy, evolutionary architecture, system decomposition; and (3) **resilience depth** - bulkheads, hedging, cell-based architecture, failure domains. The case studies are Staff-appropriate, but the concept phases backing them are currently Senior-depth. With the P0/P1 additions across Phases 3, 4, 6, and the new Security phase, the roadmap **reaches Staff**. Largest single lever: the reliability layer (#2 in the Top 20).

### Principal Engineer: *Requires the new Staff+ phase and the strategy/organizational topics.*
Principal is evaluated less on "can you design X" and more on **judgment, strategy, and organizational leverage**: trade-off analysis under ambiguity, build-vs-buy, technical strategy across multiple teams, Conway's Law, team topologies, and evolutionary architecture for systems that must change over years. **None of this exists today.** The recommended **Phase 11 (Staff+ Engineering & Architecture Leadership)** is the prerequisite for any Principal claim. Even with it, Principal readiness also depends on artifacts the roadmap can only partially teach (writing crisp ADRs, running design reviews, influencing without authority) - these should be framed as *practiced skills*, with the roadmap providing the scaffolding (ADR templates, trade-off matrices, decomposition exercises).

### Remaining gaps after all recommended additions
- **Practical exercises.** The roadmap teaches concepts excellently but has no graded exercises, mock-interview prompts, or "design this, then compare to a reference" loops. Adding a few self-assessment prompts per phase would materially raise outcomes.
- **Cross-references.** Many topics depend on others across phases (consistent hashing ↔ sharding, idempotency ↔ outbox, evals ↔ A/B testing). A lightweight "prerequisites" and "see also" header on each file would turn a linear list into a navigable graph.
- **Numbers and reference cards.** Phase 0's latency-numbers approach should be echoed with per-phase "cheat sheet" cards (e.g., a reliability cheat sheet of SLO math, a data-modeling cheat sheet).

### Bottom line
The roadmap's *architecture* is Staff/Principal-grade; its *content* currently reaches Senior in three written phases and is unwritten everywhere else. Writing Phases 3-8 to the existing quality bar gets you a top-tier **Senior** resource. Layering in the §2 additions - especially data modeling, reliability engineering, security, and the Staff+ phase - is what converts it into a genuine **Staff/Principal** curriculum.
