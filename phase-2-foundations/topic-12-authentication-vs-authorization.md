# Authentication vs. Authorization

## Concept

These two words are so frequently confused that confusing them in a design interview is a red flag. They are different problems, solved by different mechanisms, happening at different steps:

- **Authentication (AuthN)** — *"Who are you?"* Verifying the identity of the entity making a request. The entity proves they are who they claim to be.
- **Authorization (AuthZ)** — *"What are you allowed to do?"* Determining whether a verified identity has permission to perform a specific action on a specific resource.

**The critical sequence**: authentication always happens first. You can't authorise an unknown identity. Authentication establishes the identity; authorization uses that established identity to make access decisions.

**Analogy**: at a concert:
- **AuthN**: the ticket scanner verifies your ticket is real and belongs to you. You prove your identity.
- **AuthZ**: the backstage door checks your wristband. Even though you're a verified attendee, only people with a "backstage" wristband can enter backstage.

```mermaid
sequenceDiagram
    participant C as Client
    participant AuthN as Authentication
    participant API as API Server
    participant AuthZ as Authorization

    C->>AuthN: Login (username + password + 2FA)
    AuthN->>AuthN: verify credentials
    AuthN-->>C: Identity token (JWT or session)

    C->>API: DELETE /orders/42\nAuthorization: Bearer token
    API->>AuthN: Verify token signature + expiry
    AuthN-->>API: Identity: {userId: "7", roles: ["buyer"]}
    API->>AuthZ: Can user "7" (buyer) DELETE /orders/42?
    AuthZ->>AuthZ: Order 42 belongs to user 7? YES. Role "buyer" can delete own orders? YES.
    AuthZ-->>API: ALLOW
    API-->>C: 204 No Content

    Note over C,AuthZ: Separate request — different user
    C->>API: DELETE /orders/42\nAuthorization: Bearer other_token
    API->>AuthN: Verify token
    AuthN-->>API: Identity: {userId: "99", roles: ["buyer"]}
    API->>AuthZ: Can user "99" (buyer) DELETE /orders/42?
    AuthZ->>AuthZ: Order 42 belongs to user 7, NOT user 99. DENY.
    AuthZ-->>API: DENY
    API-->>C: 403 Forbidden
```

## HTTP Status Codes for Auth Errors

| Code | Name | Meaning | When to use |
|---|---|---|---|
| 401 | Unauthorized | Not authenticated | Token missing, expired, or invalid signature. Despite the name, this is an *authentication* error. Re-authenticating may fix it. |
| 403 | Forbidden | Not authorised | Authenticated but not permitted. Re-authenticating will NOT fix it. The identity is known; the permission is denied. |

**Common mistake**: returning 404 when a user requests a resource they're not authorised to see. This is a deliberate security pattern — revealing whether a resource exists leaks information. If user 99 isn't allowed to see order 42, return 404, not 403. This prevents an attacker from enumerating valid resource IDs.

## Authentication — How Identity Is Proved

### Factor types

Authentication factors fall into three categories:

| Category | Factor | Examples | Strengths | Weaknesses |
|---|---|---|---|---|
| Knowledge | Something you know | Password, PIN, security questions | Easy to implement | Can be phished, guessed, or leaked |
| Possession | Something you have | TOTP app, SMS code, hardware key (YubiKey) | Requires physical access | Can be intercepted (SMS), lost, or stolen |
| Inherence | Something you are | Fingerprint, face ID, retina | Hard to steal, non-transferable | Not revocable, false positives/negatives |

**MFA (Multi-Factor Authentication)**: requiring factors from at least two categories. The most secure practical option is **password + hardware security key (FIDO2/WebAuthn)** — phishing-resistant. Password + TOTP is also strong. Password + SMS is weak (SIM-swap attacks).

### Password storage — the right way

**Never store plaintext or reversible encryption of passwords.** Store a slow, salted hash:

```
stored = Argon2id(password + salt, iterations=3, memory=64MB, parallelism=4)
```

**Why Argon2id?**
- **Slow by design**: bcrypt costs ~100ms, scrypt/Argon2 costs 100ms–seconds. A database breach exposes the hashes. Slow hashing means an attacker can only attempt ~100 passwords/second with a GPU instead of billions.
- **Memory-hard**: Argon2id requires large amounts of RAM, making GPU/ASIC acceleration impractical.
- **Salt**: a random value (32 bytes) mixed in before hashing. Even if two users have the same password, their hashes differ. Prevents rainbow table attacks (pre-computed hash lookups).

**Hashing comparison**:
| Algorithm | Speed (GPU) | Memory-hard | Recommendation |
|---|---|---|---|
| MD5 | ~30 billion/s | No | Never use for passwords |
| SHA-256 | ~10 billion/s | No | Never use for passwords |
| bcrypt | ~100k/s | No | Acceptable, but Argon2 is better |
| scrypt | ~10k/s | Yes | Good |
| Argon2id | ~10k/s | Yes | Best current option (OWASP recommendation) |

### Common authentication attacks

| Attack | Description | Mitigation |
|---|---|---|
| Brute force | Try every possible password | Rate limiting, account lockout, CAPTCHA |
| Credential stuffing | Use leaked password lists from other breaches | Breached password check (HaveIBeenPwned API), MFA |
| Phishing | Trick user into submitting credentials to a fake site | WebAuthn/FIDO2 (phishing-resistant), HSTS preload |
| Password spraying | Try one common password against many accounts | Rate limiting per username, anomaly detection |
| Session fixation | Attacker sets a known session ID before the user logs in | Always generate a new session ID on login |
| SIM swap | Attacker convinces carrier to transfer victim's number | Don't use SMS 2FA for high-value accounts |

## Authorization Models

### RBAC — Role-Based Access Control

The most common and simplest model. Users are assigned roles; roles have permissions:

```mermaid
classDiagram
    class User {
        -id String
        -email String
        -roles List~Role~
    }
    class Role {
        -name String
        -permissions List~Permission~
    }
    class Permission {
        -resource String
        -action String
    }

    User --> Role
    Role --> Permission
```

Example roles and permissions:
```
admin:   read:orders, write:orders, delete:orders, read:users, write:users
support: read:orders, write:orders
buyer:   read:own_orders, write:own_orders
```

Check: `user.roles.any { role → role.permissions.contains("delete:orders") }`

**RBAC limitations**:
- Doesn't naturally express "user can only access their own resources" — you have to bake that into the service logic.
- Permission explosion: with many fine-grained actions, you get hundreds of permissions and complex role definitions.

### ABAC — Attribute-Based Access Control

Policies evaluate **attributes** of the subject (user), resource, action, and environment:

```
Policy: "Allow DELETE if user.id == order.buyer_id OR user.role == 'admin'"
Policy: "Allow write:orders if user.subscription_tier == 'premium'"
Policy: "Allow login if request.ip IN office_network OR user.mfa_verified == true"
```

More expressive than RBAC. Can encode fine-grained ownership rules, time-of-day restrictions, geographic limits, etc.

**OPA (Open Policy Agent)**: a popular, language-agnostic policy engine. Policies are written in Rego. Services query OPA with context; OPA returns an allow/deny decision. Centralises policy so it doesn't drift between services.

### ReBAC — Relationship-Based Access Control

Used by Google (Zanzibar paper), GitHub, and Google Drive. Permissions depend on the relationships between entities in a graph:

```
tuple: (user:alice, viewer, document:report-42)
tuple: (group:engineering, editor, folder:designs)
tuple: (user:bob, member, group:engineering)
```

Check: "Can user:bob view document:report-42?"
→ Is bob a viewer of report-42? No.
→ Is bob a member of a group that's a viewer of report-42? No.
→ Is report-42 in a folder where engineering has viewer rights? Yes (if report-42 is in folder:designs).
→ Is bob in group:engineering? Yes.
→ ALLOW.

ReBAC handles complex sharing models naturally (Google Drive "share with link", GitHub team permissions). The tradeoff is complexity — you need a graph database and recursive resolution.

## API Key Authentication

API keys are for **machine-to-machine** authentication where human login flows are impractical:

```
Authorization: ApiKey sk_live_a7f5c3e8d4b24f9a8c1e3b7d2a5f9c8e
```

**Secure API key design**:
- Generate with cryptographically secure random (CSPRNG): 256-bit key.
- Store a **hash** (e.g., SHA-256) of the key — not the key itself. Just like passwords.
- On validation: `storedHash == SHA256(submittedKey)` — if match, authenticated.
- If the database is breached, attackers get hashes, not usable keys.
- The key itself is only shown to the user once on creation — it cannot be retrieved again.
- Keys should be scoped to permissions: `read-only`, `full-access`, per-resource.
- Keys should be revocable without affecting other keys or requiring password changes.

**API key format** (Stripe's pattern — contains the tier for fast routing):
```
sk_live_xxx    — secret key, production
sk_test_xxx    — secret key, test environment
pk_live_xxx    — publishable key, can be embedded in frontend (limited permissions)
```

## Service-to-Service Authentication

When microservices call each other, they also need to authenticate:

### Mutual TLS (mTLS)

Both client and server present TLS certificates:

```mermaid
sequenceDiagram
    participant S1 as Service A (cert: A)
    participant S2 as Service B (cert: B)

    S1->>S2: TLS ClientHello + cert A
    S2->>S2: Verify cert A against CA
    S2-->>S1: TLS ServerHello + cert B
    S1->>S1: Verify cert B against CA
    Note over S1,S2: Mutual authentication complete
    S1->>S2: Encrypted request
```

**mTLS in a service mesh** (Istio, Linkerd): the mesh injects sidecar proxies that handle mTLS automatically. Services don't need to manage certificates directly — the mesh issues short-lived certificates, rotates them automatically, and enforces mutual auth.

### JWT service tokens

An internal token service issues signed JWTs for each service:
```json
{
  "iss": "internal-token-service",
  "sub": "order-service",
  "aud": "payment-service",
  "scope": ["charge:card"],
  "exp": 1700003600
}
```

Simpler to implement than mTLS. The receiving service verifies the signature and checks `aud` and `scope`. Short-lived tokens (5–15 min) limit damage from leakage.

### Network policy only (zero-trust opposite)

Trust all traffic that arrives on the internal network. Simple, but provides no defence in depth — if one service is compromised, it can impersonate any other.

**Industry trend**: zero-trust networks. Every service-to-service call is authenticated (mTLS or JWT). Network connectivity alone does not imply trust.

## Centralised vs. Distributed Authorization

| Approach | How it works | Pros | Cons |
|---|---|---|---|
| Centralised (OPA, Casbin, AWS IAM) | Services query a policy engine per request | Consistent rules, auditable, one place to update | Extra network hop per request |
| Distributed (logic in each service) | Each service enforces its own rules | No extra latency | Rules drift across services, hard to audit |
| Hybrid | Services cache policy decisions | Low latency + consistency | Staleness window on rule changes |

For most companies: embed RBAC in the service (simple) or use a shared policy engine for complex ABAC scenarios.
