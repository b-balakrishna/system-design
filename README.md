# 🧠 System Design — Frontend, Backend & Everything In Between

A structured, self-paced roadmap for mastering system design end-to-end — from how browsers render pixels to how distributed systems reach consensus across data centers. Most system design resources focus only on backend. This one doesn't. Every layer of the stack is a first-class citizen here.

Built for engineers who want to go beyond tutorials and understand *why* systems are designed the way they are — whether that's a React rendering pipeline, a sharding strategy, or a multi-region failover plan.

---

## 📖 How to Use This Repo

Each topic lives in its own markdown file inside the relevant phase folder. Start from Phase 1 if you're building from scratch, or jump to any phase if you're filling specific gaps.

```
system-design/
├── phase-1-foundations/
├── phase-2-backend/
├── phase-3-distributed-systems/
├── phase-4-frontend/
└── phase-5-cloud-and-scalability/
```

---

## 🗺️ Roadmap

### Phase 1 — Foundations

> The building blocks every engineer must internalize before designing any system.

| Topic | Description |
|---|---|
| Client-Server Architecture | How clients and servers communicate; request-response model |
| HTTP & HTTPS | Protocol mechanics, methods, status codes, TLS/SSL |
| DNS | Domain resolution, record types, propagation |
| CDN | Content delivery networks, edge caching, cache invalidation |
| OSI Model & Networking | 7 layers, TCP/IP, UDP, how data travels across networks |
| Browser Architecture | Processes, threads, rendering engine, JS engine |
| WebSockets & Long Polling | Real-time communication — polling vs SSE vs WebSocket |
| REST APIs | Resource-based design, statelessness, constraints |
| Authentication vs Authorization | Identity verification vs permission scoping |
| Cookies, Sessions, JWT | Stateful vs stateless auth strategies |
| Caching Basics | Cache-aside, write-through, TTL, invalidation |
| Rate Limiting | Token bucket, leaky bucket, sliding window — protecting APIs |
| Database Fundamentals | ACID, transactions, normalization |
| SQL vs NoSQL | Relational vs document/key-value/graph trade-offs |

---

### Phase 2 — Backend System Design

> Core patterns for building reliable, scalable server-side systems.

| Topic | Description |
|---|---|
| Monolith Architecture | Single deployable unit; simplicity vs coupling |
| Modular Monolith | Domain-separated code within a monolith; stepping stone to microservices |
| Microservices Architecture | Independent services, bounded contexts, inter-service communication |
| Load Balancers | L4 vs L7, round-robin, least connections, sticky sessions |
| Reverse Proxy | Request forwarding, SSL termination, rate limiting |
| API Gateway | Routing, auth, rate limiting, aggregation at the edge |
| Circuit Breaker | Fault tolerance, fail-fast, half-open state, Hystrix/Resilience4j |
| Database Indexing | B-tree, composite indexes, covering indexes, trade-offs |
| Replication | Leader-follower, synchronous vs async, read replicas |
| Sharding | Horizontal partitioning, shard keys, hotspot avoidance |
| Connection Pooling | Why raw connections are expensive, pool sizing, PgBouncer |
| Redis | In-memory data store, pub/sub, sorted sets, use cases |
| Message Queues | Async decoupling, Kafka vs RabbitMQ, at-least-once delivery |
| Message Broker vs Event Streaming | SNS/SQS vs Kafka — when to use which |

---

### Phase 3 — Distributed Systems

> The hard problems that emerge when you break systems across multiple machines.

| Topic | Description |
|---|---|
| CAP Theorem | Consistency, Availability, Partition Tolerance — pick two |
| Consistency Models | Strong, sequential, causal, read-your-writes |
| Eventual Consistency | How systems converge without locking |
| CQRS | Separating read and write models for scale |
| Event Sourcing | State as an append-only log of events |
| Saga Pattern | Managing distributed transactions across services |
| Distributed Transactions | Two-phase commit, compensating transactions |
| Service Discovery | Client-side vs server-side, Consul, Eureka |
| Consensus Algorithms | Raft, Paxos — how nodes agree in the face of failures |
| Leader Election | Bully algorithm, ZooKeeper, why it matters in distributed systems |
| Consistent Hashing | Distributing load across nodes with minimal reshuffling |
| Bloom Filters | Probabilistic data structures — space-efficient membership checks |
| Distributed Caching | Consistent hashing, cache invalidation at scale |

---

### Phase 4 — Frontend System Design

> Often overlooked in system design interviews — but critical for modern applications.

| Topic | Description |
|---|---|
| Browser Rendering Pipeline | Parse → Style → Layout → Paint → Composite |
| Critical Rendering Path | Minimizing time-to-first-paint |
| CSR vs SSR vs SSG vs ISR | Rendering strategies and when to use each |
| Virtual DOM | Diffing, reconciliation, when it helps and when it doesn't |
| State Management | Local, global, server, URL state — choosing the right tool |
| Code Splitting | Route-based and component-based splitting strategies |
| Lazy Loading | Images, components, routes — deferring non-critical resources |
| Web Workers & Service Workers | Offloading computation; offline support and background sync |
| Browser Storage | localStorage, sessionStorage, IndexedDB — when to use each |
| WebSockets on the Frontend | Real-time UI patterns, connection management, reconnect strategies |
| Bundlers & Build Tools | Webpack, Vite, esbuild — module graphs, tree shaking, HMR |
| Progressive Web Apps (PWA) | App shell, service workers, push notifications, installability |
| Micro Frontends | Independent deployability, module federation, trade-offs |
| Design Systems | Tokens, component libraries, consistency at scale |
| Accessibility (a11y) at Scale | ARIA, keyboard navigation, screen readers, auditing at the org level |
| Frontend Performance | Core Web Vitals, LCP, CLS, INP, profiling and optimization |

---

### Phase 5 — Cloud & Scalability

> Making systems production-ready, observable, and resilient at scale.

| Topic | Description |
|---|---|
| Docker | Containerization, images, layers, networking |
| Kubernetes | Orchestration, pods, services, deployments, scaling |
| Serverless Architecture | FaaS, Lambda, cold starts, event-driven design, trade-offs |
| CI/CD | Pipelines, blue-green deploys, canary releases, rollback |
| Infrastructure as Code | Terraform, Pulumi — declarative infra, state management, drift |
| AWS Fundamentals | EC2, S3, RDS, Lambda, VPC, IAM — core building blocks |
| High Availability | Redundancy, failover, SLAs, eliminating single points of failure |
| Disaster Recovery | RTO, RPO, backup strategies, runbooks |
| Observability | The three pillars — logs, metrics, traces |
| Logging, Metrics, Tracing | ELK, Prometheus/Grafana, OpenTelemetry, distributed tracing |
| Security Architecture | Zero trust, least privilege, secrets management, threat modeling |
| Cost Optimization | Right-sizing, spot instances, reserved capacity, FinOps principles |
| Multi-Region Design | Data residency, latency, active-active vs active-passive |

---

## 🎯 Who This Is For

- **Frontend engineers** who want to go deep on browser internals, rendering strategies, performance, and micro frontends
- **Backend engineers** who want to go deep on distributed systems, database internals, scalability patterns, and resilience
- **Full-stack engineers** who want a single structured reference across the entire stack
- **Engineers preparing for system design interviews** — frontend, backend, or both (L4–L6)
- Anyone building production systems who wants to understand *every layer*, not just their own

---

## 🤝 Contributing

Contributions welcome. If you're adding a new topic:

1. Place the file in the correct phase folder
2. Follow the existing doc format (concept → problem it solves → trade-offs → examples)
3. Open a PR with a brief description of what's added

---

## ⭐ Star this repo if it helps

If this roadmap saves you hours of scattered Googling, a star goes a long way.
