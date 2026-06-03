# 🧠 System Design — From Foundations to Scale

A structured, self-paced roadmap for mastering system design — covering frontend, backend, distributed systems, and cloud architecture. Built for engineers who want to go beyond tutorials and understand *why* systems are designed the way they are.

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
| Browser Architecture | Processes, threads, rendering engine, JS engine |
| REST APIs | Resource-based design, statelessness, constraints |
| Authentication vs Authorization | Identity verification vs permission scoping |
| Cookies, Sessions, JWT | Stateful vs stateless auth strategies |
| Caching Basics | Cache-aside, write-through, TTL, invalidation |
| Database Fundamentals | ACID, transactions, normalization |
| SQL vs NoSQL | Relational vs document/key-value/graph trade-offs |

---

### Phase 2 — Backend System Design

> Core patterns for building reliable, scalable server-side systems.

| Topic | Description |
|---|---|
| Monolith Architecture | Single deployable unit; simplicity vs coupling |
| Modular Monolith | Domain-separated code within a monolith; stepping stone to microservices |
| Load Balancers | L4 vs L7, round-robin, least connections, sticky sessions |
| Reverse Proxy | Request forwarding, SSL termination, rate limiting |
| API Gateway | Routing, auth, rate limiting, aggregation at the edge |
| Database Indexing | B-tree, composite indexes, covering indexes, trade-offs |
| Replication | Leader-follower, synchronous vs async, read replicas |
| Sharding | Horizontal partitioning, shard keys, hotspot avoidance |
| Redis | In-memory data store, pub/sub, sorted sets, use cases |
| Message Queues | Async decoupling, Kafka vs RabbitMQ, at-least-once delivery |

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
| Micro Frontends | Independent deployability, module federation, trade-offs |
| Design Systems | Tokens, component libraries, consistency at scale |
| Frontend Performance | Core Web Vitals, LCP, CLS, INP, profiling and optimization |

---

### Phase 5 — Cloud & Scalability

> Making systems production-ready, observable, and resilient at scale.

| Topic | Description |
|---|---|
| Docker | Containerization, images, layers, networking |
| Kubernetes | Orchestration, pods, services, deployments, scaling |
| CI/CD | Pipelines, blue-green deploys, canary releases, rollback |
| AWS Fundamentals | EC2, S3, RDS, Lambda, VPC, IAM — core building blocks |
| High Availability | Redundancy, failover, SLAs, eliminating single points of failure |
| Disaster Recovery | RTO, RPO, backup strategies, runbooks |
| Observability | The three pillars — logs, metrics, traces |
| Logging, Metrics, Tracing | ELK, Prometheus/Grafana, OpenTelemetry, distributed tracing |
| Security Architecture | Zero trust, least privilege, secrets management, threat modeling |
| Multi-Region Design | Data residency, latency, active-active vs active-passive |

---

## 🎯 Who This Is For

- Engineers preparing for system design interviews (L4–L6)
- Frontend engineers expanding into full-stack/infra thinking
- Backend engineers formalizing distributed systems knowledge
- Anyone building production systems who wants a structured mental model

---

## 🤝 Contributing

Contributions welcome. If you're adding a new topic:

1. Place the file in the correct phase folder
2. Follow the existing doc format (concept → problem it solves → trade-offs → examples)
3. Open a PR with a brief description of what's added

---

## ⭐ Star this repo if it helps

If this roadmap saves you hours of scattered Googling, a star goes a long way.
