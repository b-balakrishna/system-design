# HTTP/2 and HTTP/3 (QUIC)

## Concept

HTTP has evolved through three versions, each addressing the performance limits of its predecessor. The semantics (methods, status codes, headers from topic 2) stay the same across all three. Only the **wire format** - how bytes are encoded and sent - changes.

| Version | Transport | Released | Key change |
| - | - | - | - |
| HTTP/1.0 | TCP | 1996 | One request per connection |
| HTTP/1.1 | TCP | 1997 | Persistent connections, pipelining (broken in practice) |
| HTTP/2 | TCP | 2015 | Binary framing, multiplexing, header compression, server push |
| HTTP/3 | QUIC (UDP) | 2022 | Eliminates TCP HOL blocking, 0-RTT, connection migration |

**Analogy for multiplexing**: HTTP/1.1 is a single-lane road - one car at a time, in order. HTTP/2 is a multi-lane highway - many cars travel simultaneously on different lanes. HTTP/3 is the same highway but each lane is completely independent - a crash in lane 3 doesn't slow down lane 1 (fixing the HOL blocking that still existed in HTTP/2).

## The Problem HTTP/1.1 Created

### Head-of-line (HOL) blocking

In HTTP/1.1, one TCP connection can process **one request at a time**:

```
Connection 1: GET /page.html ──► (wait) ──► GET /style.css ──► (wait) ──► GET /app.js
```

The browser opens 6-8 parallel TCP connections as a workaround. Each connection still has HOL blocking within it, and 6+ TCP connections waste sockets, memory, and bandwidth.

### Header redundancy

Every HTTP/1.1 request resends the same headers (cookies, User-Agent, Authorization) in full plain text:

```
Request 1:  User-Agent: Mozilla/5.0 ... (87 bytes)
            Cookie: session=abc; theme=dark; lang=en (52 bytes)
            Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9... (312 bytes)

Request 2:  User-Agent: Mozilla/5.0 ... (87 bytes again  -  identical!)
            Cookie: session=abc; theme=dark; lang=en (52 bytes again!)
            ...
```

A typical API request has 400-800 bytes of headers. On a page loading 100 resources, that's 40-80 KB of redundant header data.

## HTTP/2

### Binary framing

HTTP/1.1 is plain ASCII text. HTTP/2 uses a **binary framing layer**:

```
HTTP/1.1 request (text):
GET /index.html HTTP/1.1\r\n
Host: example.com\r\n
\r\n

HTTP/2 frame (binary):
┌─────────────────────────────────────────┐
│ Length (24 bits) │ Type (8 bits)        │
├─────────────────────────────────────────┤
│ Flags (8 bits)   │ Stream ID (31 bits)  │
├─────────────────────────────────────────┤
│ Payload ...                             │
└─────────────────────────────────────────┘
```

Frame types:
- `HEADERS` - carries compressed request/response headers
- `DATA` - carries the request/response body
- `WINDOW_UPDATE` - flow control
- `SETTINGS` - exchange connection parameters
- `PING` - keepalive and RTT measurement
- `RST_STREAM` - cancel a stream
- `GOAWAY` - gracefully shut down a connection

### Multiplexing: the core innovation

A single TCP connection carries multiple independent **streams** simultaneously:

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server

    Note over C,S: HTTP/1.1  -  sequential requests (3 RTTs for 3 resources)
    C->>S: GET /style.css
    S-->>C: 200 CSS
    C->>S: GET /app.js
    S-->>C: 200 JS
    C->>S: GET /logo.png
    S-->>C: 200 PNG

    Note over C,S: HTTP/2  -  multiplexed (1 RTT for all resources)
    C->>S: stream 1: HEADERS GET /style.css
    C->>S: stream 3: HEADERS GET /app.js
    C->>S: stream 5: HEADERS GET /logo.png
    S-->>C: stream 1: DATA CSS (interleaved)
    S-->>C: stream 3: DATA JS (interleaved)
    S-->>C: stream 5: DATA PNG (interleaved)
```

Streams are identified by integer IDs (odd for client-initiated, even for server push). Frames from different streams are **interleaved** on the wire and reassembled independently. A slow stream does not block other streams - at the HTTP layer.

### HPACK: Header Compression

HPACK (RFC 7541) compresses headers using two tables:

**Static table** (61 entries): common headers and values pre-defined in the spec.
```
Index 2: :method GET
Index 5: :scheme https
Index 7: :status 200
```

**Dynamic table**: grows during the connection with header values seen at runtime.

On the first request, headers are sent in full and added to the dynamic table. On subsequent requests, the sender refers to the table by index:

```
First request:  Authorization: Bearer eyJ... → sent in full → added as index 62
Second request: :62  (1 byte instead of 312 bytes)
```

Typical compression ratio: **85-95%** reduction in header size for API-heavy workloads. A 400-byte header block becomes 20-60 bytes.

### Server Push

HTTP/2 allows the server to push resources the client hasn't requested yet:

```mermaid
sequenceDiagram
    participant C as Browser
    participant S as Server

    C->>S: GET /index.html
    S-->>C: PUSH_PROMISE stream 2: /critical.css
    S-->>C: PUSH_PROMISE stream 4: /above-fold.js
    S-->>C: 200 index.html (stream 1)
    S-->>C: 200 critical.css (stream 2)
    S-->>C: 200 above-fold.js (stream 4)
    Note over C: HTML parsed  -  browser needs /critical.css
    Note over C: Already in push cache! No request needed.
```

**Reality check**: Server push has been largely abandoned. Chrome removed support for it in 2022. Problems:
- The server doesn't know what's already in the browser cache - may push resources the browser already has.
- The browser can cancel a pushed stream but already paid for the data sent before the cancel.

**Modern replacement**: `Link: </critical.css>; rel=preload` header. The server hints "you'll need this"; the browser decides whether to fetch (checking its cache first).

### Stream prioritisation

HTTP/2 streams can declare **dependencies** and **weights**, letting the browser tell the server "render-blocking CSS is more urgent than below-fold images." In practice, prioritisation implementations vary across servers and browsers and is being simplified in HTTP/3.

## HTTP/2 Limitations: TCP HOL Blocking

HTTP/2 solved HTTP-level HOL blocking but introduced a new form: **TCP-level HOL blocking**.

TCP guarantees ordered delivery. If packet #5 is lost in a connection carrying 10 HTTP/2 streams, TCP holds back packets 6, 7, 8... waiting for a retransmit of #5. All 10 HTTP/2 streams are frozen, even though only one stream cares about packet #5.

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Network
    participant S as Server

    S->>N: stream1 frame A (packet 5)
    S->>N: stream2 frame B (packet 6)
    S->>N: stream3 frame C (packet 7)
    Note over N: Packet 5 lost!
    N-->>C: packet 6 (stream2 frame B)  -  held in buffer
    N-->>C: packet 7 (stream3 frame C)  -  held in buffer
    Note over C: TCP holds all data until packet 5 is retransmitted
    S->>N: retransmit packet 5
    N-->>C: packet 5, 6, 7 delivered in order
    Note over C: All 3 streams unblock simultaneously
```

On high-packet-loss networks (mobile, satellite), this makes HTTP/2 slower than HTTP/1.1 with multiple connections - each HTTP/1.1 connection has independent TCP state, so only the affected connection stalls.

## HTTP/3 and QUIC

### QUIC: UDP + reliability reimplemented

QUIC (Quick UDP Internet Connections) was developed by Google (~2012), standardised by IETF as RFC 9000 (2021). It reimplements the reliable features of TCP on top of UDP, while fixing its design mistakes:

**QUIC = UDP + ordered reliable delivery (per stream) + TLS 1.3 (built-in) + multiplexing + connection migration**

```mermaid
flowchart TD
    HTTP3["HTTP/3 (application)"]
    QUIC["QUIC (transport)\n- Multiplexed streams\n- Per-stream reliability\n- TLS 1.3 built-in\n- Connection migration"]
    UDP["UDP"]
    IP["IP"]

    HTTP3 --> QUIC --> UDP --> IP
```

Compare with HTTP/2:
```mermaid
flowchart TD
    HTTP2["HTTP/2 (application)\n- Multiplexed streams\n- HPACK compression"]
    TLS["TLS 1.3 (security)"]
    TCP["TCP (transport)\n- Ordered delivery (all streams share one sequence space)"]
    IP["IP"]

    HTTP2 --> TLS --> TCP --> IP
```

### Stream isolation: solving TCP HOL blocking

In QUIC, each stream has **independent flow control and delivery**. A lost UDP packet stalls only the stream whose data it carried:

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Network

    Note over C,N: QUIC  -  stream-level isolation
    N-->>C: stream 1 data A ✓
    N-->>C: stream 2 data B ✓
    Note over N: stream 3 data C (lost!)
    N-->>C: stream 1 data D ✓  (continues unaffected)
    N-->>C: stream 2 data E ✓  (continues unaffected)
    Note over N: stream 3 data C retransmitted
    N-->>C: stream 3 data C ✓  (only stream 3 was stalled)
```

### Connection establishment: 0 vs 1 RTT

HTTP/2 requires:
1. TCP SYN/SYN-ACK/ACK: 1 RTT
2. TLS 1.3 handshake: 1 RTT
3. HTTP request: first data leaves after 2 RTTs

QUIC combines transport + TLS into one handshake:
1. QUIC + TLS 1.3 combined handshake: 1 RTT
2. HTTP/3 request: first data leaves after 1 RTT

With session resumption (0-RTT):
- Client sends data in the very first packet (TLS 1.3 0-RTT mode)
- Server processes it before handshake completes
- Effective latency for returning clients: 0 additional RTTs

**0-RTT replay risk**: 0-RTT data can be replayed by a network attacker. A response to `GET /user/42/profile` is safe to replay. A response to `POST /payments` is not. Only send idempotent requests in 0-RTT.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server

    Note over C,S: New QUIC connection (1 RTT)
    C->>S: Initial packet (CRYPTO: ClientHello)
    S-->>C: Handshake packet (CRYPTO: ServerHello, Certificate, Finished)
    C->>S: Handshake packet (CRYPTO: Finished) + 1-RTT data
    Note over C,S: Resume QUIC connection (0-RTT)
    C->>S: Initial packet (session ticket) + 0-RTT data
    S-->>C: Handshake packet + 1-RTT response
```

### Connection migration

TCP connections are identified by a 4-tuple: (src IP, src port, dst IP, dst port). If your phone switches from Wi-Fi to cellular, your IP address changes → the TCP connection breaks → everything must reconnect.

QUIC connections are identified by a **Connection ID** - a random value chosen by the endpoints. The Connection ID doesn't change when the network path changes:

```mermaid
sequenceDiagram
    participant C as Phone
    participant W as Wi-Fi Network
    participant LTE as LTE Network
    participant S as Server

    Note over C,S: Connected via Wi-Fi (IP: 192.168.1.5)
    C->>W: QUIC data [CID: abc123] (src: 192.168.1.5)
    W->>S: QUIC data [CID: abc123]
    Note over C: Switches to LTE (IP: 10.0.0.42)
    C->>LTE: QUIC data [CID: abc123] (src: 10.0.0.42)
    LTE->>S: QUIC data [CID: abc123]
    Note over S: Same CID  -  same connection, new path
    S-->>C: QUIC data [CID: abc123]
    Note over C,S: Zero-downtime migration  -  video call continues uninterrupted
```

This is transformative for mobile: video calls, streaming, and downloads survive network handoffs without reconnecting.

### QUIC header encryption

QUIC encrypts packet headers (not just payload). This prevents middleboxes from reading sequence numbers, stream IDs, or connection IDs. The benefit: middleboxes can't ossify the protocol by inspecting and making assumptions about these fields (a major reason TCP hasn't evolved significantly in 30 years).

## How Browsers Negotiate Protocol Versions

### ALPN: Application Layer Protocol Negotiation

During TLS handshake, the client advertises supported protocols via ALPN extension:

```
TLS ClientHello:
  ALPN: ["h3", "h2", "http/1.1"]
```

The server responds with its chosen protocol:
```
TLS ServerHello:
  ALPN: "h2"
```

ALPN is how HTTP/2 is negotiated - no separate round trip needed.

### Alt-Svc: HTTP/3 Discovery

HTTP/3 (QUIC, UDP) can't be negotiated in a TLS handshake for the first connection because you start with TCP. The server advertises HTTP/3 support via the `Alt-Svc` header:

```
HTTP/2 response:
Alt-Svc: h3=":443"; ma=86400
```

The browser caches this and uses HTTP/3 (QUIC/UDP) for subsequent connections to the same origin for up to 86400 seconds.

## Performance Numbers

Real-world benchmarks (varies by network conditions):

| Metric | HTTP/1.1 | HTTP/2 | HTTP/3 |
| - | - | - | - |
| Page load (50+ assets, good network) | Baseline | 20-40% faster | 20-40% faster |
| Page load (packet loss 2%) | Baseline | Similar to H1 | 30-50% faster |
| Header overhead per request | 400-800 bytes | 20-60 bytes | 20-60 bytes |
| Connection establishment (new) | 2 RTTs | 2 RTTs | 1 RTT |
| Connection establishment (resume) | 2 RTTs | 2 RTTs | 0 RTTs |
| Mobile network handoff downtime | ~1-3 seconds | ~1-3 seconds | ~0 seconds |

HTTP/2 and HTTP/3 show the biggest gains when:
- Pages load many small resources (JS bundles, CSS, API calls)
- Network conditions are poor (packet loss, high latency)
- Users are on mobile (switching networks, variable latency)

HTTP/2 and HTTP/3 show minimal gains for:
- Single large file downloads (database dump, video file)
- Low-latency, low-loss LAN connections

## Trade-offs and When to Use Each

| Scenario | Recommended |
| - | - |
| Modern browser serving a web app | HTTP/2 or HTTP/3 (both, let ALPN + Alt-Svc decide) |
| Internal microservice calls | HTTP/2 (gRPC runs on HTTP/2) or HTTP/3 if high packet loss |
| Mobile-heavy user base | HTTP/3 (connection migration + packet loss resilience) |
| Corporate proxy environment | HTTP/2 (some firewalls block UDP 443) |
| Single large file download | Any - difference is minimal |
| Legacy clients | HTTP/1.1 fallback (always maintain) |

**Deployment reality**: enable HTTP/2 and HTTP/3 on your CDN and servers. Both fall back to HTTP/1.1 gracefully for unsupported clients. No application code changes are needed - the performance improvement is free.

## Common Interview Questions

**Q: Does HTTP/2 multiplexing eliminate the need for domain sharding?**
A: Yes. HTTP/1.1 used domain sharding (serving assets from cdn1.example.com, cdn2.example.com) to bypass the 6-connection limit. HTTP/2 makes this counter-productive - multiple domains mean multiple TCP connections and multiple TLS handshakes, losing multiplexing benefits.

**Q: Can HTTP/2 be used without TLS?**
A: Technically yes (h2c = cleartext). In practice, all major browsers only support HTTP/2 over TLS. Treat HTTP/2 as requiring HTTPS.

**Q: What's the real-world adoption of HTTP/3?**
A: As of 2024, ~30% of web traffic uses HTTP/3. Google, Meta, Cloudflare, and Fastly have deployed it. Chrome, Firefox, and Safari all support it. Server support: nginx (experimental), Caddy (native), LiteSpeed (native), and all major CDNs.
