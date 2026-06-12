# HTTP and HTTPS

## Concept

- **HTTP** (HyperText Transfer Protocol) is the application-layer protocol that clients and servers use to exchange messages on the web. Defined in RFC 7230–7235 (HTTP/1.1) and RFC 9110 (HTTP Semantics, shared across versions).
- Every HTTP exchange is a **request** from the client and a **response** from the server. The request asks for something; the response delivers it.
- HTTP is **stateless** — the server holds no memory of previous requests. This is a deliberate design choice that makes servers easy to scale: any server in a pool can handle any request because every request is self-contained.
- **HTTPS** is HTTP over **TLS** (Transport Layer Security). TLS wraps the HTTP exchange in an encrypted tunnel that provides:
  - **Confidentiality** — the payload is encrypted; a network eavesdropper sees only ciphertext.
  - **Integrity** — a MAC (Message Authentication Code) detects any in-transit tampering.
  - **Authentication** — the server's certificate proves its identity to the client.

**Why HTTPS everywhere?** On any shared network (coffee shop Wi-Fi, corporate proxy, mobile carrier), an attacker can read plain HTTP traffic. Even if your API doesn't carry passwords, unencrypted traffic can be injected with malicious scripts or ads. Google Chrome marks all HTTP sites as "Not Secure". Browsers block mixed content (an HTTPS page loading HTTP resources).

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant S as Server

    Note over C,S: Plain HTTP — observable by anyone on the network
    C->>S: GET /login HTTP/1.1\nHost: example.com
    S-->>C: 200 OK\n{form: ...}

    Note over C,S: HTTPS — encrypted, only client and server can read
    C->>S: TCP SYN
    S-->>C: TCP SYN-ACK
    C->>S: TCP ACK (connection established)
    C->>S: TLS ClientHello
    S-->>C: TLS ServerHello + Certificate
    C->>S: TLS Finished (key exchange complete)
    C->>S: GET /login HTTP/1.1 [encrypted]
    S-->>C: 200 OK [encrypted]
```

## HTTP Methods — The Vocabulary of Intent

HTTP methods tell the server what the client wants to do. Choosing the right method is not just convention — it affects caching, idempotency, and how intermediaries (proxies, load balancers) treat requests.

| Method | Semantics | Idempotent | Safe | Cacheable |
|---|---|---|---|---|
| GET | Retrieve a resource | Yes | Yes | Yes |
| HEAD | Same as GET but body-less | Yes | Yes | Yes |
| POST | Create a resource or submit data | No | No | Only with explicit headers |
| PUT | Replace a resource entirely | Yes | No | No |
| PATCH | Partially update a resource | No* | No | No |
| DELETE | Remove a resource | Yes | No | No |
| OPTIONS | Discover allowed methods | Yes | Yes | No |

**Idempotent**: repeating the request N times produces the same server state as sending it once. `DELETE /orders/42` is idempotent — once deleted, deleting again changes nothing (server returns 404).

**Safe**: the request has no side effects — it only reads. Safe implies idempotent. GET and HEAD must not modify server state.

*PATCH can be designed to be idempotent (e.g., `SET field = value`), but it's not guaranteed by the spec.

### When to use PUT vs PATCH

```
PUT /users/42
{"name": "Alice", "email": "new@example.com", "role": "admin"}
```
`PUT` replaces the entire resource. If you omit `role`, it gets deleted or reset.

```
PATCH /users/42
{"email": "new@example.com"}
```
`PATCH` modifies only the supplied fields. More efficient for large resources; more common in practice.

## HTTP Status Codes — The Server's Reply

Status codes are three-digit integers grouped by family:

### 2xx — Success

| Code | Name | When to use |
|---|---|---|
| 200 | OK | Standard success for GET, PUT, PATCH |
| 201 | Created | Resource was created — include `Location: /resource/42` header |
| 202 | Accepted | Request accepted for async processing (job queued) |
| 204 | No Content | Success but no body — common for DELETE, logout |

### 3xx — Redirection

| Code | Name | When to use |
|---|---|---|
| 301 | Moved Permanently | Domain change, URL restructure — browsers cache this forever |
| 302 | Found | Temporary redirect — browser follows but doesn't cache |
| 304 | Not Modified | Conditional GET — cached copy is still valid |
| 307 | Temporary Redirect | Like 302 but preserves the HTTP method (POST stays POST) |
| 308 | Permanent Redirect | Like 301 but preserves the HTTP method |

**Gotcha**: 301 vs 302 — use 301 for permanent changes (CDN and browser will cache). Use 302 for temporary redirects. Use 307/308 when the method matters (redirect a POST form submission).

### 4xx — Client Errors

| Code | Name | When to use |
|---|---|---|
| 400 | Bad Request | Malformed request body, invalid parameters |
| 401 | Unauthorized | Not authenticated — send `WWW-Authenticate` header |
| 403 | Forbidden | Authenticated but not permitted |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method for this endpoint |
| 409 | Conflict | Duplicate resource, optimistic lock conflict |
| 410 | Gone | Resource existed but was permanently removed |
| 422 | Unprocessable Entity | Syntactically valid but semantically invalid |
| 429 | Too Many Requests | Rate limit exceeded — include `Retry-After` header |

**401 vs 403**: 401 means "I don't know who you are." 403 means "I know who you are, and you can't do this." Re-authenticating fixes 401; it doesn't fix 403.

### 5xx — Server Errors

| Code | Name | When to use |
|---|---|---|
| 500 | Internal Server Error | Unhandled exception, unexpected state |
| 502 | Bad Gateway | Upstream service returned an invalid response |
| 503 | Service Unavailable | Server overloaded or in maintenance — include `Retry-After` |
| 504 | Gateway Timeout | Upstream service timed out |

## HTTP Headers — The Metadata Layer

Headers carry metadata about the request or response. They are key-value pairs separated by `:`.

### Critical request headers

```
GET /api/products?category=electronics HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
Accept: application/json
Accept-Encoding: gzip, br
Accept-Language: en-US,en;q=0.9
Cache-Control: no-cache
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Content-Type: application/json
```

- `Host` — required in HTTP/1.1. One IP can serve many domains (virtual hosting).
- `Authorization` — credentials for the request.
- `Accept` — what formats the client can handle. Server uses `Content-Type` in response to confirm what it sent.
- `Accept-Encoding` — compression algorithms the client supports. Server compresses if it can.
- `If-None-Match` — conditional request. If the ETag matches, server returns 304 (no body, saving bandwidth).
- `If-Modified-Since` — similar to If-None-Match but based on timestamp.

### Critical response headers

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 1452
Content-Encoding: gzip
Cache-Control: public, max-age=300, stale-while-revalidate=60
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Vary: Accept-Encoding
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

- `Content-Encoding: gzip` — body is compressed; client must decompress.
- `Cache-Control: stale-while-revalidate=60` — serve stale cache while revalidating in the background. Great for performance.
- `ETag` — fingerprint of the resource. Client sends it in `If-None-Match` on the next request.
- `Vary: Accept-Encoding` — tells caches to store separate copies for different encodings.
- `Strict-Transport-Security` — tells the browser to only ever connect over HTTPS for this domain, for 1 year.

### Security headers explained

| Header | What it prevents |
|---|---|
| `Strict-Transport-Security` | SSL stripping attacks — forces HTTPS |
| `Content-Security-Policy` | XSS — controls which scripts/styles/images can load |
| `X-Content-Type-Options: nosniff` | MIME-type sniffing attacks |
| `X-Frame-Options: DENY` | Clickjacking — prevents embedding in iframes |
| `Referrer-Policy` | Controls how much of the URL is sent in `Referer` header |

## HTTPS and TLS — Deep Dive

### Why TLS, not just encryption?

Encryption alone isn't enough. If an attacker intercepts traffic and substitutes their own certificate, they can decrypt and re-encrypt everything while the user sees the padlock icon. TLS prevents this via **certificate authentication**: the server proves it holds the private key corresponding to a certificate issued by a trusted Certificate Authority (CA).

### Certificate Authority chain

```mermaid
flowchart TD
    Root["Root CA\n(embedded in OS/browser trust store)"]
    Int["Intermediate CA\n(Let's Encrypt, DigiCert, etc.)"]
    Leaf["Leaf Certificate\n(api.example.com)"]

    Root -->|signs| Int
    Int -->|signs| Leaf
    Leaf -->|presented by| Server
```

Why the intermediate CA layer?
- Root CA private keys are stored in air-gapped hardware vaults, rarely used.
- Intermediate CAs do the day-to-day signing. If an intermediate is compromised, it can be revoked without disturbing the root.

### TLS 1.3 handshake (the modern standard)

TLS 1.3 (RFC 8446) dramatically simplified and sped up the handshake compared to TLS 1.2:

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server

    Note over C,S: TLS 1.3 — 1 Round Trip

    C->>S: ClientHello\n(cipher suites, key_share, random)
    S-->>C: ServerHello + Certificate + CertificateVerify + Finished\n(key_share, chosen cipher)
    Note over C: Derive session keys from key_shares
    C->>S: Finished [encrypted]
    C->>S: HTTP Request [encrypted]
    S-->>C: HTTP Response [encrypted]
```

Key improvements over TLS 1.2:
- **1 RTT** instead of 2 for new connections.
- **0-RTT resumption**: on reconnect, client sends data in the very first packet (using a pre-shared session ticket). Risk: replay attacks — only use for idempotent requests.
- **Forward secrecy always**: uses ephemeral Diffie-Hellman keys; past traffic can't be decrypted even if the private key is later leaked.
- **Removed weak algorithms**: RC4, MD5, SHA-1, static RSA key exchange, DH < 2048 bits are all gone.

### HSTS and HSTS Preloading

`Strict-Transport-Security` (HSTS) tells the browser: "For the next 31536000 seconds (1 year), only ever connect to this domain over HTTPS, even if the user types `http://`."

**HSTS Preload**: submit your domain to `hstspreload.org` and browsers ship with your domain hardcoded as HTTPS-only before the user has ever visited it. No plain HTTP request is ever made, even on first visit. Eliminates the bootstrap problem where the first request could be intercepted.

### Certificate Transparency (CT)

CT logs are public, append-only records of every issued TLS certificate. Browsers require certificates to be logged in CT logs. If a CA issues a certificate for `google.com` maliciously, Google's certificate monitoring detects it and triggers revocation.

## HTTP Request-Response Anatomy

### Full request example

```
POST /api/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJ...
Content-Type: application/json
Content-Length: 87
Accept: application/json

{"items": [{"productId": "p1", "quantity": 2}], "shippingAddress": "Berlin, DE"}
```

Structure:
1. **Request line**: `METHOD path HTTP/version`
2. **Headers**: one per line, `Key: Value`, ends with blank line
3. **Body**: optional, present for POST/PUT/PATCH

### Full response example

```
HTTP/1.1 201 Created
Location: /api/orders/42
Content-Type: application/json
Content-Length: 156
Cache-Control: no-store

{"id": 42, "status": "pending", "total": 199.98, "estimatedDelivery": "2024-12-01"}
```

Structure:
1. **Status line**: `HTTP/version STATUS_CODE reason_phrase`
2. **Headers**: one per line
3. **Body**: optional

## Common Pitfalls and Interview Tips

### Pitfall 1: PUT vs POST for creation
- `POST /orders` — let the server assign the ID. Status: 201 + Location header.
- `PUT /orders/42` — client dictates the ID. Idempotent. Only use if the client can safely pick a collision-free ID (e.g., UUID).

### Pitfall 2: GET with a body
- Technically allowed by the spec but widely unsupported by proxies and caches. Never use it. Use POST or query parameters instead for complex filters.

### Pitfall 3: Caching dynamic content
- `Cache-Control: no-store` — don't cache at all (user-specific data).
- `Cache-Control: no-cache` — cache but revalidate before serving (ETag check).
- These are often confused. `no-cache` doesn't mean "don't cache" — it means "always check freshness."

### Pitfall 4: 200 vs 204 for deletes
- Return 204 (no content) for successful DELETE when there's nothing meaningful to return.
- Return 200 with a body if you return the deleted resource or a confirmation message.

### Pitfall 5: Ignoring Idempotency-Key for POST
- POST `/payments` called twice due to a network retry can charge a customer twice.
- Accept an `Idempotency-Key: uuid` header. Store the result keyed by uuid. Return the cached result for duplicate requests.
