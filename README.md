# System Design: Frontend, Backend & Everything In Between

[![Topics](https://img.shields.io/badge/curriculum-211%20%2F%20211%20topics-brightgreen)](README.md)
[![Integrity Gates](https://img.shields.io/badge/quality%20gates-100%25%20passing-success)](scripts/verify-repo.py)
[![Interactive Viewer](https://img.shields.io/badge/interactive%20viewer-live-blueviolet)](viewer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A structured, production-grade roadmap for mastering system design end to end: from interview framing and low-level design to distributed systems, frontend architecture, cloud scalability, AI/ML systems, and real-world case studies.

Most system design resources focus only on backend architecture. This repo treats every layer of the stack as a first-class design surface: APIs, databases, browsers, rendering, infrastructure, observability, ML serving, and trade-off communication.

---

## Interactive Web Viewer & Quick Start

This repository includes a modern, high-performance web viewer with instant full-text search, keyboard shortcuts (`Cmd+K`, arrow keys), a personal study progress tracker, and interactive Mermaid architecture diagrams.

```bash
# 1. Clone the repository
git clone https://github.com/b-balakrishna/system-design.git
cd system-design

# 2. Run the interactive reader locally
pnpm --prefix viewer dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to study offline or locally.

---

## The 45-Minute Interview Pacing Guide

In a FAANG / Tier-1 system design interview, managing your time is half the evaluation. Use this 45-minute pacing rubric:

| Time | Phase | Focus & Deliverables |
|---|---|---|
| **0 - 5 min** | **Scope & Requirements** | Clarify functional vs non-functional requirements. Define scale (DAU, write/read ratio), define out-of-scope boundaries. |
| **5 - 10 min** | **Capacity Estimation** | Compute back-of-the-envelope math: QPS (average & peak), network ingress/egress, cache RAM, and 5-year storage. |
| **10 - 25 min** | **High-Level Design** | Sketch end-to-end architecture (Client -> Gateway -> Microservices -> Storage). Define API endpoints and data model schema. |
| **25 - 40 min** | **Deep Dives & Trade-offs** | Dive into 2-3 core bottlenecks: caching strategies, concurrency control (locks vs Saga), data partitioning, and failure recovery. |
| **40 - 45 min** | **Wrap-up & Resilience** | Summarize single points of failure (SPOFs), monitoring metrics, SLOs, and horizontal auto-scaling. |

---

## How to Use This Repo

Each topic lives in its own markdown file inside the relevant phase folder. Start with Phase 0 if you are preparing for interviews, Phase 1 if you want to strengthen object-oriented design, or jump directly to the phase that matches your current gaps.

```text
system-design/
├── phase-0-interview-primer/
├── phase-1-low-level-design/
├── phase-2-foundations/
├── phase-3-backend/
├── phase-4-distributed-systems/
├── phase-5-frontend/
├── phase-6-cloud-and-scalability/
├── phase-7-ai-and-ml-systems/
└── phase-8-case-studies/
```

---

## Roadmap

| Phase | Folder | Focus | Topics |
|---|---|---|---:|
| Phase 0 | [Interview Primer](phase-0-interview-primer) | Interview framing, requirements, estimation, diagrams, trade-offs | 8 |
| Phase 1 | [Low Level Design](phase-1-low-level-design) | SOLID, design patterns, UML, LLD case studies, concurrency | 7 |
| Phase 2 | [Foundations](phase-2-foundations) | Networking, protocols, APIs, auth, caching, databases, data modeling | 20 |
| Phase 3 | [Backend](phase-3-backend) | Backend & data architecture, databases, queues, messaging reliability, search, storage | 38 |
| Phase 4 | [Distributed Systems](phase-4-distributed-systems) | Consistency, consensus, transactions, clocks, event/stream patterns, resilience, distributed data structures | 32 |
| Phase 5 | [Frontend](phase-5-frontend) | Browser internals, rendering, state, data fetching, performance, observability, frontend architecture | 29 |
| Phase 6 | [Cloud and Scalability](phase-6-cloud-and-scalability) | Containers, cloud, delivery, observability, reliability engineering (SLOs, chaos, autoscaling), platform & security | 28 |
| Phase 7 | [AI and ML Systems](phase-7-ai-and-ml-systems) | ML infrastructure, LLMs, RAG, agents, context engineering, MCP, semantic caching, safety & evals | 26 |
| Phase 8 | [Case Studies](phase-8-case-studies) | End-to-end system design examples | 23 |

---

## Phase 0: Interview Primer

> How to approach system design interviews with structure, numbers, diagrams, and clear trade-off communication.

| # | Topic |
|---:|---|
| 1 | [The 6-Step Framework](phase-0-interview-primer/topic-1-the-6-step-framework.md) |
| 2 | [Functional vs Non-Functional Requirements](phase-0-interview-primer/topic-2-functional-vs-non-functional-requirements.md) |
| 3 | [Capacity Estimation](phase-0-interview-primer/topic-3-capacity-estimation.md) |
| 4 | [Latency Numbers Every Engineer Should Know](phase-0-interview-primer/topic-4-latency-numbers-every-engineer-should-know.md) |
| 5 | [API Design in Interviews](phase-0-interview-primer/topic-5-api-design-in-interviews.md) |
| 6 | [Drawing System Diagrams](phase-0-interview-primer/topic-6-drawing-system-diagrams.md) |
| 7 | [Trade-Off Communication](phase-0-interview-primer/topic-7-trade-off-communication.md) |
| 8 | [Scaling a Design](phase-0-interview-primer/topic-8-scaling-a-design.md) |

---

## Phase 1: Low-Level Design

> Object-oriented design foundations for building maintainable systems and discussing component-level architecture.

| # | Topic |
|---:|---|
| 1 | [SOLID Principles](phase-1-low-level-design/topic-1-solid-principles.md) |
| 2 | [Design Patterns: Creational](phase-1-low-level-design/topic-2-design-patterns-creational.md) |
| 3 | [Design Patterns: Structural](phase-1-low-level-design/topic-3-design-patterns-structural.md) |
| 4 | [Design Patterns: Behavioral](phase-1-low-level-design/topic-4-design-patterns-behavioral.md) |
| 5 | [UML and Class Diagrams](phase-1-low-level-design/topic-5-uml-and-class-diagrams.md) |
| 6 | [LLD Case Studies](phase-1-low-level-design/topic-6-lld-case-studies.md) |
| 7 | [Concurrency in Low-Level Design](phase-1-low-level-design/topic-7-concurrency-in-low-level-design.md) |

---

## Phase 2: Foundations

> The protocol, networking, API, authentication, caching, and database basics every system design discussion builds on.

| # | Topic |
|---:|---|
| 1 | [Client-Server Architecture](phase-2-foundations/topic-1-client-server-architecture.md) |
| 2 | [HTTP and HTTPS](phase-2-foundations/topic-2-http-and-https.md) |
| 3 | [HTTP/2 and HTTP/3 QUIC](phase-2-foundations/topic-3-http2-and-http3-quic.md) |
| 4 | [DNS](phase-2-foundations/topic-4-dns.md) |
| 5 | [CDN](phase-2-foundations/topic-5-cdn.md) |
| 6 | [OSI Model and Networking](phase-2-foundations/topic-6-osi-model-and-networking.md) |
| 7 | [Browser Architecture](phase-2-foundations/topic-7-browser-architecture.md) |
| 8 | [WebSockets and Long Polling](phase-2-foundations/topic-8-websockets-and-long-polling.md) |
| 9 | [REST APIs](phase-2-foundations/topic-9-rest-apis.md) |
| 10 | [GraphQL](phase-2-foundations/topic-10-graphql.md) |
| 11 | [gRPC and Protocol Buffers](phase-2-foundations/topic-11-grpc-and-protocol-buffers.md) |
| 12 | [Authentication vs Authorization](phase-2-foundations/topic-12-authentication-vs-authorization.md) |
| 13 | [OAuth 2.0 and OpenID Connect](phase-2-foundations/topic-13-oauth-2-0-and-openid-connect.md) |
| 14 | [Cookies, Sessions, JWT](phase-2-foundations/topic-14-cookies-sessions-jwt.md) |
| 15 | [API Versioning](phase-2-foundations/topic-15-api-versioning.md) |
| 16 | [Caching Basics](phase-2-foundations/topic-16-caching-basics.md) |
| 17 | [Rate Limiting](phase-2-foundations/topic-17-rate-limiting.md) |
| 18 | [Database Fundamentals](phase-2-foundations/topic-18-database-fundamentals.md) |
| 19 | [SQL vs NoSQL](phase-2-foundations/topic-19-sql-vs-nosql.md) |
| 20 | [Data Modeling & Schema Design](phase-2-foundations/topic-20-data-modeling-and-schema-design.md) |

---

## Phase 3: Backend & Data Architecture

> Core patterns for building reliable, scalable server-side systems, plus data-layer internals, backend architecture discipline, and messaging reliability.

| # | Topic |
|---:|---|
| 1 | [Monolith Architecture](phase-3-backend/topic-1-monolith-architecture.md) |
| 2 | [Modular Monolith](phase-3-backend/topic-2-modular-monolith.md) |
| 3 | [Microservices Architecture](phase-3-backend/topic-3-microservices-architecture.md) |
| 4 | [Service Mesh](phase-3-backend/topic-4-service-mesh.md) |
| 5 | [Load Balancers](phase-3-backend/topic-5-load-balancers.md) |
| 6 | [Reverse Proxy](phase-3-backend/topic-6-reverse-proxy.md) |
| 7 | [API Gateway](phase-3-backend/topic-7-api-gateway.md) |
| 8 | [Circuit Breaker](phase-3-backend/topic-8-circuit-breaker.md) |
| 9 | [Database Internals](phase-3-backend/topic-9-database-internals.md) |
| 10 | [Database Indexing](phase-3-backend/topic-10-database-indexing.md) |
| 11 | [Database Isolation Levels](phase-3-backend/topic-11-database-isolation-levels.md) |
| 12 | [Database Migrations](phase-3-backend/topic-12-database-migrations.md) |
| 13 | [Replication](phase-3-backend/topic-13-replication.md) |
| 14 | [Sharding](phase-3-backend/topic-14-sharding.md) |
| 15 | [Connection Pooling](phase-3-backend/topic-15-connection-pooling.md) |
| 16 | [Distributed Locking](phase-3-backend/topic-16-distributed-locking.md) |
| 17 | [Unique ID Generation](phase-3-backend/topic-17-unique-id-generation.md) |
| 18 | [Redis](phase-3-backend/topic-18-redis.md) |
| 19 | [Message Queues](phase-3-backend/topic-19-message-queues.md) |
| 20 | [Task Queues](phase-3-backend/topic-20-task-queues.md) |
| 21 | [Message Broker vs Event Streaming](phase-3-backend/topic-21-message-broker-vs-event-streaming.md) |
| 22 | [Idempotency](phase-3-backend/topic-22-idempotency.md) |
| 23 | [Search Systems](phase-3-backend/topic-23-search-systems.md) |
| 24 | [Object Storage](phase-3-backend/topic-24-object-storage.md) |
| 25 | [Concurrency and Thread Models](phase-3-backend/topic-25-concurrency-and-thread-models.md) |
| 26 | [Domain-Driven Design (DDD)](phase-3-backend/topic-26-domain-driven-design.md) |
| 27 | [Clean & Hexagonal Architecture](phase-3-backend/topic-27-clean-and-hexagonal-architecture.md) |
| 28 | [Multi-Tenant Architecture](phase-3-backend/topic-28-multi-tenant-architecture.md) |
| 29 | [Backend-for-Frontend (BFF)](phase-3-backend/topic-29-backend-for-frontend-bff.md) |
| 30 | [Storage Engines: B-Trees vs LSM-Trees](phase-3-backend/topic-30-storage-engines-btrees-vs-lsm-trees.md) |
| 31 | [Query Optimization & Execution Plans](phase-3-backend/topic-31-query-optimization-and-execution-plans.md) |
| 32 | [Partitioning Strategies & Hot Partitions](phase-3-backend/topic-32-partitioning-strategies-and-hot-partitions.md) |
| 33 | [Secondary Indexes](phase-3-backend/topic-33-secondary-indexes.md) |
| 34 | [Data Lifecycle & Archival](phase-3-backend/topic-34-data-lifecycle-and-archival.md) |
| 35 | [Dead Letter Queues & Retry Strategies](phase-3-backend/topic-35-dead-letter-queues-and-retry-strategies.md) |
| 36 | [Outbox & Inbox Pattern](phase-3-backend/topic-36-outbox-and-inbox-pattern.md) |
| 37 | [Exactly-Once vs At-Least-Once Delivery](phase-3-backend/topic-37-exactly-once-vs-at-least-once-delivery.md) |
| 38 | [Choreography vs Orchestration](phase-3-backend/topic-38-choreography-vs-orchestration.md) |

> New in this revision (topics 26-38): backend architecture discipline (DDD, hexagonal, multi-tenancy, BFF), data-layer depth (storage engines, query optimization, partitioning/hot partitions, secondary indexes, data lifecycle), and messaging reliability (DLQ/retries, outbox/inbox, delivery semantics, choreography vs orchestration). See `ROADMAP-REVIEW.md` for the full rationale.

---

## Phase 4: Distributed Systems

> The hard problems that emerge when systems are split across machines, regions, and failure domains.

| # | Topic |
|---:|---|
| 1 | [CAP Theorem](phase-4-distributed-systems/topic-1-cap-theorem.md) |
| 2 | [PACELC Theorem](phase-4-distributed-systems/topic-2-pacelc-theorem.md) |
| 3 | [Consistency Models](phase-4-distributed-systems/topic-3-consistency-models.md) |
| 4 | [Eventual Consistency](phase-4-distributed-systems/topic-4-eventual-consistency.md) |
| 5 | [Logical Clocks and Vector Clocks](phase-4-distributed-systems/topic-5-logical-clocks-and-vector-clocks.md) |
| 6 | [Gossip Protocol](phase-4-distributed-systems/topic-6-gossip-protocol.md) |
| 7 | [Heartbeats and Failure Detection](phase-4-distributed-systems/topic-7-heartbeats-and-failure-detection.md) |
| 8 | [Backpressure](phase-4-distributed-systems/topic-8-backpressure.md) |
| 9 | [CQRS](phase-4-distributed-systems/topic-9-cqrs.md) |
| 10 | [Event Sourcing](phase-4-distributed-systems/topic-10-event-sourcing.md) |
| 11 | [Saga Pattern](phase-4-distributed-systems/topic-11-saga-pattern.md) |
| 12 | [Distributed Transactions](phase-4-distributed-systems/topic-12-distributed-transactions.md) |
| 13 | [Idempotency in Distributed Systems](phase-4-distributed-systems/topic-13-idempotency-in-distributed-systems.md) |
| 14 | [CRDTs](phase-4-distributed-systems/topic-14-crdts.md) |
| 15 | [Service Discovery](phase-4-distributed-systems/topic-15-service-discovery.md) |
| 16 | [Consensus Algorithms](phase-4-distributed-systems/topic-16-consensus-algorithms.md) |
| 17 | [Leader Election](phase-4-distributed-systems/topic-17-leader-election.md) |
| 18 | [Consistent Hashing](phase-4-distributed-systems/topic-18-consistent-hashing.md) |
| 19 | [Bloom Filters](phase-4-distributed-systems/topic-19-bloom-filters.md) |
| 20 | [Count-Min Sketch](phase-4-distributed-systems/topic-20-count-min-sketch.md) |
| 21 | [HyperLogLog](phase-4-distributed-systems/topic-21-hyperloglog.md) |
| 22 | [Distributed Caching](phase-4-distributed-systems/topic-22-distributed-caching.md) |
| 23 | [Event-Driven Architecture](phase-4-distributed-systems/topic-23-event-driven-architecture.md) |
| 24 | [Stream Processing](phase-4-distributed-systems/topic-24-stream-processing.md) |
| 25 | [Change Data Capture (CDC)](phase-4-distributed-systems/topic-25-change-data-capture-cdc.md) |
| 26 | [Kafka Internals](phase-4-distributed-systems/topic-26-kafka-internals.md) |
| 27 | [Distributed Rate Limiting](phase-4-distributed-systems/topic-27-distributed-rate-limiting.md) |
| 28 | [Distributed Scheduling](phase-4-distributed-systems/topic-28-distributed-scheduling.md) |
| 29 | [Bulkheads](phase-4-distributed-systems/topic-29-bulkheads.md) |
| 30 | [Request Hedging](phase-4-distributed-systems/topic-30-request-hedging.md) |
| 31 | [Retry Storms & Failure Domains](phase-4-distributed-systems/topic-31-retry-storms-and-failure-domains.md) |
| 32 | [Cell-Based Architecture](phase-4-distributed-systems/topic-32-cell-based-architecture.md) |

---

## Phase 5: Frontend

> Browser, rendering, performance, and application architecture topics that matter in modern frontend system design.

| # | Topic |
|---:|---|
| 1 | [Browser Rendering Pipeline](phase-5-frontend/topic-1-browser-rendering-pipeline.md) |
| 2 | [Critical Rendering Path](phase-5-frontend/topic-2-critical-rendering-path.md) |
| 3 | [CSR vs SSR vs SSG vs ISR](phase-5-frontend/topic-3-csr-vs-ssr-vs-ssg-vs-isr.md) |
| 4 | [Streaming SSR and Partial Hydration](phase-5-frontend/topic-4-streaming-ssr-and-partial-hydration.md) |
| 5 | [Virtual DOM](phase-5-frontend/topic-5-virtual-dom.md) |
| 6 | [Frontend Architecture Patterns](phase-5-frontend/topic-6-frontend-architecture-patterns.md) |
| 7 | [State Management](phase-5-frontend/topic-7-state-management.md) |
| 8 | [Code Splitting](phase-5-frontend/topic-8-code-splitting.md) |
| 9 | [Lazy Loading](phase-5-frontend/topic-9-lazy-loading.md) |
| 10 | [Image Optimization](phase-5-frontend/topic-10-image-optimization.md) |
| 11 | [Font Loading Strategies](phase-5-frontend/topic-11-font-loading-strategies.md) |
| 12 | [Web Workers and Service Workers](phase-5-frontend/topic-12-web-workers-and-service-workers.md) |
| 13 | [Browser Storage](phase-5-frontend/topic-13-browser-storage.md) |
| 14 | [WebSockets on the Frontend](phase-5-frontend/topic-14-websockets-on-the-frontend.md) |
| 15 | [SSE on the Frontend](phase-5-frontend/topic-15-sse-on-the-frontend.md) |
| 16 | [Frontend Security](phase-5-frontend/topic-16-frontend-security.md) |
| 17 | [Bundlers and Build Tools](phase-5-frontend/topic-17-bundlers-and-build-tools.md) |
| 18 | [Monorepo Architecture](phase-5-frontend/topic-18-monorepo-architecture.md) |
| 19 | [Progressive Web Apps (PWA)](phase-5-frontend/topic-19-progressive-web-apps-pwa.md) |
| 20 | [Micro Frontends](phase-5-frontend/topic-20-micro-frontends.md) |
| 21 | [Error Boundaries and Resilience](phase-5-frontend/topic-21-error-boundaries-and-resilience.md) |
| 22 | [Frontend Testing Strategy](phase-5-frontend/topic-22-frontend-testing-strategy.md) |
| 23 | [Design Systems](phase-5-frontend/topic-23-design-systems.md) |
| 24 | [Accessibility (a11y) at Scale](phase-5-frontend/topic-24-accessibility-a11y-at-scale.md) |
| 25 | [Frontend Performance](phase-5-frontend/topic-25-frontend-performance.md) |
| 26 | [Client Data Fetching & Caching](phase-5-frontend/topic-26-client-data-fetching-and-caching.md) |
| 27 | [React Architecture at Scale](phase-5-frontend/topic-27-react-architecture-at-scale.md) |
| 28 | [Frontend Observability & RUM](phase-5-frontend/topic-28-frontend-observability-and-rum.md) |
| 29 | [Frontend CI/CD & Deployment](phase-5-frontend/topic-29-frontend-ci-cd-and-deployment.md) |

> New in this revision (topics 26-29): client data fetching & caching (server-state libraries), React architecture at scale (RSC), frontend observability & RUM, and frontend CI/CD & deployment.

---

## Phase 6: Cloud & Scalability

> Production readiness: deployment, cloud infrastructure, observability, resilience, security, and operating cost.

| # | Topic |
|---:|---|
| 1 | [Docker](phase-6-cloud-and-scalability/topic-1-docker.md) |
| 2 | [Kubernetes](phase-6-cloud-and-scalability/topic-2-kubernetes.md) |
| 3 | [Serverless Architecture](phase-6-cloud-and-scalability/topic-3-serverless-architecture.md) |
| 4 | [Edge Computing](phase-6-cloud-and-scalability/topic-4-edge-computing.md) |
| 5 | [CI/CD](phase-6-cloud-and-scalability/topic-5-ci-cd.md) |
| 6 | [Feature Flags and Progressive Delivery](phase-6-cloud-and-scalability/topic-6-feature-flags-and-progressive-delivery.md) |
| 7 | [Infrastructure as Code](phase-6-cloud-and-scalability/topic-7-infrastructure-as-code.md) |
| 8 | [AWS Fundamentals](phase-6-cloud-and-scalability/topic-8-aws-fundamentals.md) |
| 9 | [Cloud Networking](phase-6-cloud-and-scalability/topic-9-cloud-networking.md) |
| 10 | [High Availability](phase-6-cloud-and-scalability/topic-10-high-availability.md) |
| 11 | [Disaster Recovery](phase-6-cloud-and-scalability/topic-11-disaster-recovery.md) |
| 12 | [Observability](phase-6-cloud-and-scalability/topic-12-observability.md) |
| 13 | [Logging, Metrics, Tracing](phase-6-cloud-and-scalability/topic-13-logging-metrics-tracing.md) |
| 14 | [Testing Distributed Systems](phase-6-cloud-and-scalability/topic-14-testing-distributed-systems.md) |
| 15 | [Time-Series Databases](phase-6-cloud-and-scalability/topic-15-time-series-databases.md) |
| 16 | [Geospatial Indexing](phase-6-cloud-and-scalability/topic-16-geospatial-indexing.md) |
| 17 | [Data Pipelines](phase-6-cloud-and-scalability/topic-17-data-pipelines.md) |
| 18 | [Security Architecture](phase-6-cloud-and-scalability/topic-18-security-architecture.md) |
| 19 | [Cost Optimization](phase-6-cloud-and-scalability/topic-19-cost-optimization.md) |
| 20 | [Multi-Region Design](phase-6-cloud-and-scalability/topic-20-multi-region-design.md) |
| 21 | [SLOs, SLIs & Error Budgets](phase-6-cloud-and-scalability/topic-21-slos-slis-and-error-budgets.md) |
| 22 | [Chaos Engineering](phase-6-cloud-and-scalability/topic-22-chaos-engineering.md) |
| 23 | [Load & Stress Testing](phase-6-cloud-and-scalability/topic-23-load-and-stress-testing.md) |
| 24 | [Autoscaling Strategies](phase-6-cloud-and-scalability/topic-24-autoscaling-strategies.md) |
| 25 | [Deployment Strategies: Blue-Green & Canary](phase-6-cloud-and-scalability/topic-25-deployment-strategies-blue-green-and-canary.md) |
| 26 | [Capacity Planning](phase-6-cloud-and-scalability/topic-26-capacity-planning.md) |
| 27 | [Platform Engineering & Internal Developer Platforms](phase-6-cloud-and-scalability/topic-27-platform-engineering-and-idp.md) |
| 28 | [Secrets Management](phase-6-cloud-and-scalability/topic-28-secrets-management.md) |

> New in this revision (topics 21-28): the reliability-engineering layer (SLOs/SLIs/error budgets, chaos engineering, load testing, autoscaling, capacity planning), explicit deployment strategies (blue-green & canary), and platform/security (internal developer platforms, secrets management). Note: Time-Series DBs (15) and Geospatial Indexing (16) are data topics that pair with Phase 3; Data Pipelines (17) anchors the data-engineering material - see ROADMAP-REVIEW.md.

---

## Phase 7: AI & ML Systems

> Designing production ML and LLM systems, from data pipelines and serving to RAG, agents, guardrails, feedback loops, and observability.

| # | Topic |
|---:|---|
| 1 | [ML System Design Overview](phase-7-ai-and-ml-systems/topic-1-ml-system-design-overview.md) |
| 2 | [Data Pipelines for ML](phase-7-ai-and-ml-systems/topic-2-data-pipelines-for-ml.md) |
| 3 | [Model Training Infrastructure](phase-7-ai-and-ml-systems/topic-3-model-training-infrastructure.md) |
| 4 | [Fine-Tuning Infrastructure](phase-7-ai-and-ml-systems/topic-4-fine-tuning-infrastructure.md) |
| 5 | [Model Serving and Inference](phase-7-ai-and-ml-systems/topic-5-model-serving-and-inference.md) |
| 6 | [LLM Inference Architecture](phase-7-ai-and-ml-systems/topic-6-llm-inference-architecture.md) |
| 7 | [RAG: Retrieval-Augmented Generation](phase-7-ai-and-ml-systems/topic-7-rag-retrieval-augmented-generation.md) |
| 8 | [Vector Databases](phase-7-ai-and-ml-systems/topic-8-vector-databases.md) |
| 9 | [Prompt Engineering at Scale](phase-7-ai-and-ml-systems/topic-9-prompt-engineering-at-scale.md) |
| 10 | [AI Agent Architecture](phase-7-ai-and-ml-systems/topic-10-ai-agent-architecture.md) |
| 11 | [Guardrails and Content Moderation](phase-7-ai-and-ml-systems/topic-11-guardrails-and-content-moderation.md) |
| 12 | [Feedback Loops and Online Learning](phase-7-ai-and-ml-systems/topic-12-feedback-loops-and-online-learning.md) |
| 13 | [A/B Testing Models](phase-7-ai-and-ml-systems/topic-13-a-b-testing-models.md) |
| 14 | [AI Observability](phase-7-ai-and-ml-systems/topic-14-ai-observability.md) |
| 15 | [Cost and Latency Trade-Offs in AI Systems](phase-7-ai-and-ml-systems/topic-15-cost-and-latency-trade-offs-in-ai-systems.md) |
| 16 | [Feature Stores](phase-7-ai-and-ml-systems/topic-16-feature-stores.md) |
| 17 | [Model Registry & Versioning](phase-7-ai-and-ml-systems/topic-17-model-registry-and-versioning.md) |
| 18 | [Embedding Pipelines & Vector Search Architecture](phase-7-ai-and-ml-systems/topic-18-embedding-pipelines-and-vector-search-architecture.md) |
| 19 | [Context Engineering](phase-7-ai-and-ml-systems/topic-19-context-engineering.md) |
| 20 | [Tool-Calling Architecture](phase-7-ai-and-ml-systems/topic-20-tool-calling-architecture.md) |
| 21 | [Agent Memory & Long-Term Memory](phase-7-ai-and-ml-systems/topic-21-agent-memory-and-long-term-memory.md) |
| 22 | [Multi-Agent Systems](phase-7-ai-and-ml-systems/topic-22-multi-agent-systems.md) |
| 23 | [Model Context Protocol (MCP) Architecture](phase-7-ai-and-ml-systems/topic-23-mcp-model-context-protocol-architecture.md) |
| 24 | [Semantic Caching](phase-7-ai-and-ml-systems/topic-24-semantic-caching.md) |
| 25 | [Hallucination Mitigation & AI Safety](phase-7-ai-and-ml-systems/topic-25-hallucination-mitigation-and-ai-safety.md) |
| 26 | [Evaluation Pipelines](phase-7-ai-and-ml-systems/topic-26-evaluation-pipelines.md) |

> New in this revision (topics 16-26): the 2026 agentic and MLOps layer - feature stores, model registry, embedding/vector search pipelines, context engineering, tool-calling, agent memory, multi-agent systems, MCP architecture, semantic caching, hallucination mitigation/safety, and evaluation pipelines.

---

## Phase 8: Case Studies

> Full system design walkthroughs that combine requirements, architecture, data modeling, scaling, reliability, and trade-offs.

| # | Topic | Domain Category |
|---:|---|---|
| 1 | [Design a URL Shortener](phase-8-case-studies/topic-1-design-a-url-shortener.md) | Foundational Core (Batch 1) |
| 2 | [Design a Rate Limiter](phase-8-case-studies/topic-2-design-a-rate-limiter.md) | Foundational Core (Batch 1) |
| 3 | [Design Twitter/X Feed](phase-8-case-studies/topic-3-design-twitter-x-feed.md) | Foundational Core (Batch 1) |
| 4 | [Design a Notification System](phase-8-case-studies/topic-4-design-a-notification-system.md) | Foundational Core (Batch 1) |
| 5 | [Design a Chat Application](phase-8-case-studies/topic-5-design-a-chat-application.md) | Real-Time & Media (Batch 2) |
| 6 | [Design YouTube Video Platform](phase-8-case-studies/topic-6-design-youtube-video-platform.md) | Real-Time & Media (Batch 2) |
| 7 | [Design Google Docs Collaborative Editor](phase-8-case-studies/topic-7-design-google-docs-collaborative-editor.md) | Real-Time & Media (Batch 2) |
| 8 | [Design an Autocomplete Typeahead](phase-8-case-studies/topic-8-design-an-autocomplete-typeahead.md) | Real-Time & Media (Batch 2) |
| 9 | [Design a Ride-Sharing System](phase-8-case-studies/topic-9-design-a-ride-sharing-system.md) | Transactional & FinTech (Batch 3) |
| 10 | [Design an E-Commerce Checkout](phase-8-case-studies/topic-10-design-an-e-commerce-checkout.md) | Transactional & FinTech (Batch 3) |
| 11 | [Design a Payment System Wallet](phase-8-case-studies/topic-11-design-a-payment-system-wallet.md) | Transactional & FinTech (Batch 3) |
| 12 | [Design a Web Crawler Search Indexer](phase-8-case-studies/topic-12-design-a-web-crawler-search-indexer.md) | Distributed Infra & Data (Batch 4) |
| 13 | [Design a Distributed Job Scheduler](phase-8-case-studies/topic-13-design-a-distributed-job-scheduler.md) | Distributed Infra & Data (Batch 4) |
| 14 | [Design an Ad Click Aggregator](phase-8-case-studies/topic-14-design-an-ad-click-aggregator.md) | Distributed Infra & Data (Batch 4) |
| 15 | [Design a CI/CD Pipeline](phase-8-case-studies/topic-15-design-a-ci-cd-pipeline.md) | Distributed Infra & Data (Batch 4) |
| 16 | [Design an LLM-Powered Search](phase-8-case-studies/topic-16-design-an-llm-powered-search.md) | Applied AI & Modern Frontend (Batch 5) |
| 17 | [Design a React Component Library](phase-8-case-studies/topic-17-design-a-react-component-library.md) | Applied AI & Modern Frontend (Batch 5) |
| 18 | [Design a Cloud Storage System](phase-8-case-studies/topic-18-design-a-cloud-storage-system.md) | Advanced Infra & Emerging Paradigms (Batch 6) |
| 19 | [Design a Proximity Service](phase-8-case-studies/topic-19-design-a-proximity-service.md) | Advanced Infra & Emerging Paradigms (Batch 6) |
| 20 | [Design a Metrics Monitoring System](phase-8-case-studies/topic-20-design-a-metrics-monitoring-system.md) | Advanced Infra & Emerging Paradigms (Batch 6) |
| 21 | [Design a Live Streaming Platform](phase-8-case-studies/topic-21-design-a-live-streaming-platform.md) | Advanced Infra & Emerging Paradigms (Batch 6) |
| 22 | [Design a Distributed Key-Value Store](phase-8-case-studies/topic-22-design-a-distributed-key-value-store.md) | Advanced Infra & Emerging Paradigms (Batch 6) |
| 23 | [Design an LLM Serving Platform](phase-8-case-studies/topic-23-design-an-llm-serving-platform.md) | Advanced Infra & Emerging Paradigms (Batch 6) |

---

## Who This Is For

- Frontend engineers who want to go deep on browser internals, rendering strategies, performance, and micro frontends
- Backend engineers who want to go deep on distributed systems, database internals, scalability patterns, and resilience
- Full-stack engineers who want a single structured reference across the entire stack
- Engineers preparing for system design interviews, frontend, backend, low-level design, or AI/ML systems
- Anyone building production systems who wants to understand every layer, not just their own

---

## Contributing

Contributions are welcome. If you are adding a new topic:

1. Place the file in the correct phase folder.
2. Follow the existing doc format: concept, problem it solves, trade-offs, and examples.
3. Keep the topic number sequential within that phase.
4. Update this README so the roadmap stays aligned with the project structure.

---

## Star This Repo

If this roadmap saves you hours of scattered searching, a star goes a long way.
