# Concurrency and Thread Models

## Concept

- **Concurrency** is structuring a program to make progress on many tasks at once. How a server achieves it — its **thread/execution model** — determines its throughput, latency, and how it handles thousands of simultaneous connections.
- The major models:
  - **Thread-per-request (blocking)** — one OS thread per connection; simple to write, but threads are heavy (~1 MB stack each) and context-switching limits you to thousands, not millions. (Classic Java servlets, Apache prefork.)
  - **Event loop (non-blocking / async I/O)** — a single (or few) thread handles many connections by never blocking; I/O waits register callbacks. Scales to huge connection counts with low memory. (Node.js, Nginx, Netty, Python asyncio.)
  - **Thread pool** — a bounded set of worker threads pull tasks from a queue; decouples request count from thread count.
  - **Coroutines / green threads / virtual threads** — lightweight user-space "threads" multiplexed onto few OS threads, giving blocking-style code with event-loop scalability. (Go goroutines, Java virtual threads, Kotlin coroutines.)
- Underlying constraints: CPU-bound work needs real parallelism (multiple cores); I/O-bound work just needs to not block while waiting.

```mermaid
flowchart TB
    subgraph TPR["Thread-per-request"]
        R1[Req] --> T1[Thread blocks on I/O]
    end
    subgraph EL["Event loop"]
        R2[Many reqs] --> E[Single loop] --> CB[Callbacks on I/O ready]
    end
```

## Problem It Solves

- Determines how many simultaneous users/connections one machine can serve and at what latency.
- The right model prevents a server from being throttled by thread overhead (C10k/C10M problem) or by blocking on slow I/O.
- Explains real performance behavior: why a Node event loop serves 50k idle WebSocket connections cheaply, and why one CPU-heavy handler stalls it.

## Trade-offs

- **Simplicity vs. scalability** — blocking thread-per-request is the easiest to reason about but caps connection count and wastes memory; event loops scale but invert control flow (callbacks/async, harder to read and debug).
- **I/O-bound vs. CPU-bound** — event loops excel at I/O-bound workloads; for CPU-bound work a single loop is the *wrong* tool — one heavy computation blocks everything. Offload CPU work to a worker pool/process.
- **Shared state hazards** — true parallelism (thread pools, multi-core) introduces **race conditions, deadlocks, and the need for locks** — the multi-machine version is distributed locking (topic 16).
- **Global locks** — runtimes like CPython's GIL prevent threads from running Python bytecode in parallel, pushing CPU-bound work to multiprocessing.
- **Backpressure** — async systems must bound in-flight work or they exhaust memory under overload (Phase 4: backpressure).

## Examples

- **Why Node handles many connections**
  - A chat server holding 100k WebSocket connections mostly waits on I/O; one event loop manages them with little memory. But a synchronous JSON parse of a huge payload blocks all 100k — so heavy work is offloaded to worker threads.
- **Go's model**
  - Goroutines are cheap (a few KB); the runtime multiplexes millions onto a handful of OS threads and parallelizes across cores — blocking-style code with high scalability.
- **Thread pool sizing**
  - For CPU-bound work, pool size ≈ core count; for I/O-bound work, larger pools help because threads spend time waiting. (Mirrors connection-pool sizing, topic 15.)
- **Race condition**
  - Two threads doing `count = count + 1` without a lock lose updates; fix with atomic operations, a mutex, or a single-writer design.
- **Interview framing**
  - When asked about handling many concurrent connections (chat, realtime, high-QPS APIs), name the model — "event-loop / async I/O for I/O-bound connection-heavy workloads, worker pools for CPU-bound work" — and mention offloading CPU work and bounding in-flight requests for backpressure.
