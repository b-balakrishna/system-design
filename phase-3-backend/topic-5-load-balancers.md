# Load Balancers

## Concept

- A **load balancer (LB)** distributes incoming requests across a pool of backend instances so no single instance is overwhelmed, and so the system survives the loss of any one instance.
- It is the enabler of **horizontal scaling**: stateless app servers behind an LB can be added or removed freely.
- LBs operate at two layers:
  - **L4 (transport)** — routes by IP/port, blind to content. Extremely fast, used for raw TCP/UDP throughput.
  - **L7 (application)** — parses HTTP, routes by path/header/cookie, can terminate TLS, do sticky sessions, and rewrite requests.
- The LB is also a **health checker**: it probes backends and stops sending traffic to unhealthy ones.

```mermaid
flowchart TB
    C[Clients] --> LB{Load Balancer}
    LB -->|health-checked| S1[Server 1]
    LB --> S2[Server 2]
    LB --> S3[Server 3]
    LB -.x.-> S4[Server 4 unhealthy]
```

## Problem It Solves

- Spreads load so capacity scales with instance count instead of being capped by one box.
- Removes the single point of failure at the app tier — if a server dies, the LB routes around it.
- Enables zero-downtime deploys: drain a server, deploy, re-add it.
- Provides a stable entry point (one VIP/DNS name) hiding a fleet that changes constantly.
- Can offload TLS termination, compression, and basic DoS protection from app servers.

## Trade-offs

- **L4 vs. L7** — L4 is faster and protocol-agnostic; L7 is smarter (content routing, TLS, retries) but costs more CPU and latency.
- **Algorithm choice** — round-robin is simple but ignores load; least-connections adapts to slow requests; consistent hashing (Phase 4) preserves cache locality but rebalances poorly on resize.
- **Sticky sessions vs. statelessness** — pinning a user to one server simplifies in-memory sessions but breaks even load distribution and fails when that server dies; prefer stateless servers with shared session storage (Phase 2).
- **The LB itself is a SPOF** — it must be made redundant (active-passive pairs, or DNS/anycast across multiple LBs).
- **Health-check tuning** — too aggressive ejects healthy nodes on a blip; too lax keeps sending traffic to dead ones.

## Examples

- **Balancing algorithms**
  - *Round robin* — even rotation; good when requests are uniform.
  - *Least connections* — sends to the least-busy server; good when request durations vary.
  - *Weighted* — bigger servers get more traffic.
  - *IP hash / consistent hash* — same client → same server, for cache affinity or sticky sessions.
- **Layered LBs**
  - Global DNS-based or anycast LB routes users to the nearest region; a regional L7 LB then distributes within the data center.
- **Health checks**
  - Active: LB periodically hits `/healthz`. Passive: LB observes real request failures and ejects the host (outlier detection).
- **Cloud examples**
  - AWS ALB (L7), NLB (L4); GCP Cloud Load Balancing; HAProxy and Nginx as software LBs.
- **Interview framing**
  - "Stateless app servers behind an L7 load balancer with health checks" is the standard scalable web tier. Mention TLS termination and a redundant LB pair to show production awareness.
