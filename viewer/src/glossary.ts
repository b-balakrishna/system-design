export interface GlossaryTerm {
  abbr: string;
  full: string;
}

export interface GlossarySection {
  category: string;
  terms: GlossaryTerm[];
}

export const GLOSSARY: GlossarySection[] = [
  {
    category: "Protocols & Transport",
    terms: [
      { abbr: "HTTP",       full: "HyperText Transfer Protocol" },
      { abbr: "HTTPS",      full: "HyperText Transfer Protocol Secure" },
      { abbr: "HTTP/2",     full: "HyperText Transfer Protocol version 2" },
      { abbr: "HTTP/3",     full: "HyperText Transfer Protocol version 3" },
      { abbr: "QUIC",       full: "Quick UDP Internet Connections" },
      { abbr: "TCP",        full: "Transmission Control Protocol" },
      { abbr: "UDP",        full: "User Datagram Protocol" },
      { abbr: "TLS",        full: "Transport Layer Security" },
      { abbr: "SSL",        full: "Secure Sockets Layer" },
      { abbr: "gRPC",       full: "Google Remote Procedure Call" },
      { abbr: "RPC",        full: "Remote Procedure Call" },
      { abbr: "WebSocket",  full: "WebSocket Protocol (RFC 6455)" },
      { abbr: "SSE",        full: "Server-Sent Events" },
    ],
  },
  {
    category: "APIs & Authentication",
    terms: [
      { abbr: "API",        full: "Application Programming Interface" },
      { abbr: "REST",       full: "Representational State Transfer" },
      { abbr: "GraphQL",    full: "Graph Query Language" },
      { abbr: "OAuth",      full: "Open Authorization" },
      { abbr: "OAuth 2.0",  full: "Open Authorization 2.0" },
      { abbr: "OpenID",     full: "OpenID Connect — Identity Layer over OAuth 2.0" },
      { abbr: "JWT",        full: "JSON Web Token" },
      { abbr: "CORS",       full: "Cross-Origin Resource Sharing" },
      { abbr: "CSRF",       full: "Cross-Site Request Forgery" },
      { abbr: "XSS",        full: "Cross-Site Scripting" },
    ],
  },
  {
    category: "Databases & Storage",
    terms: [
      { abbr: "SQL",        full: "Structured Query Language" },
      { abbr: "NoSQL",      full: "Not Only SQL" },
      { abbr: "ORM",        full: "Object-Relational Mapping" },
      { abbr: "ACID",       full: "Atomicity, Consistency, Isolation, Durability" },
      { abbr: "BASE",       full: "Basically Available, Soft State, Eventually Consistent" },
    ],
  },
  {
    category: "Networking & Infrastructure",
    terms: [
      { abbr: "CDN",        full: "Content Delivery Network" },
      { abbr: "DNS",        full: "Domain Name System" },
      { abbr: "OSI",        full: "Open Systems Interconnection (7-layer model)" },
      { abbr: "IP",         full: "Internet Protocol" },
      { abbr: "URL",        full: "Uniform Resource Locator" },
      { abbr: "AWS",        full: "Amazon Web Services" },
      { abbr: "CI/CD",      full: "Continuous Integration / Continuous Deployment" },
      { abbr: "CI",         full: "Continuous Integration" },
      { abbr: "CD",         full: "Continuous Deployment" },
      { abbr: "IaC",        full: "Infrastructure as Code" },
    ],
  },
  {
    category: "Frontend Rendering Patterns",
    terms: [
      { abbr: "CSR",        full: "Client-Side Rendering" },
      { abbr: "SSR",        full: "Server-Side Rendering" },
      { abbr: "SSG",        full: "Static Site Generation" },
      { abbr: "ISR",        full: "Incremental Static Regeneration" },
      { abbr: "SPA",        full: "Single-Page Application" },
      { abbr: "PWA",        full: "Progressive Web App" },
      { abbr: "MPA",        full: "Multi-Page Application" },
      { abbr: "DOM",        full: "Document Object Model" },
      { abbr: "HTML",       full: "HyperText Markup Language" },
      { abbr: "CSS",        full: "Cascading Style Sheets" },
    ],
  },
  {
    category: "Architecture & Design",
    terms: [
      { abbr: "UML",        full: "Unified Modeling Language" },
      { abbr: "LLD",        full: "Low-Level Design" },
      { abbr: "HLD",        full: "High-Level Design" },
      { abbr: "SOLID",      full: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion" },
      { abbr: "DDD",        full: "Domain-Driven Design" },
      { abbr: "CQRS",       full: "Command Query Responsibility Segregation" },
      { abbr: "CRDT",       full: "Conflict-Free Replicated Data Type" },
      { abbr: "BFF",        full: "Backend for Frontend" },
      { abbr: "SDK",        full: "Software Development Kit" },
      { abbr: "CLI",        full: "Command-Line Interface" },
    ],
  },
  {
    category: "Distributed Systems",
    terms: [
      { abbr: "CAP",        full: "Consistency, Availability, Partition Tolerance (Theorem)" },
      { abbr: "PACELC",     full: "Partition → Availability/Consistency, Else → Latency/Consistency" },
      { abbr: "2PC",        full: "Two-Phase Commit" },
      { abbr: "3PC",        full: "Three-Phase Commit" },
      { abbr: "SLA",        full: "Service Level Agreement" },
      { abbr: "SLO",        full: "Service Level Objective" },
      { abbr: "SLI",        full: "Service Level Indicator" },
      { abbr: "RPO",        full: "Recovery Point Objective" },
      { abbr: "RTO",        full: "Recovery Time Objective" },
      { abbr: "MTTR",       full: "Mean Time To Recovery" },
      { abbr: "MTBF",       full: "Mean Time Between Failures" },
    ],
  },
  {
    category: "AI & Machine Learning",
    terms: [
      { abbr: "AI",         full: "Artificial Intelligence" },
      { abbr: "ML",         full: "Machine Learning" },
      { abbr: "LLM",        full: "Large Language Model" },
      { abbr: "RAG",        full: "Retrieval-Augmented Generation" },
      { abbr: "NLP",        full: "Natural Language Processing" },
      { abbr: "GPU",        full: "Graphics Processing Unit" },
      { abbr: "TPU",        full: "Tensor Processing Unit" },
      { abbr: "RLHF",       full: "Reinforcement Learning from Human Feedback" },
      { abbr: "LoRA",       full: "Low-Rank Adaptation (fine-tuning method)" },
    ],
  },
  {
    category: "General & Miscellaneous",
    terms: [
      { abbr: "UI",         full: "User Interface" },
      { abbr: "UX",         full: "User Experience" },
      { abbr: "ID",         full: "Identifier" },
      { abbr: "UUID",       full: "Universally Unique Identifier" },
      { abbr: "ULID",       full: "Universally Unique Lexicographically Sortable Identifier" },
      { abbr: "QPS",        full: "Queries Per Second" },
      { abbr: "RPS",        full: "Requests Per Second" },
      { abbr: "TPS",        full: "Transactions Per Second" },
      { abbr: "P50/P99",    full: "50th / 99th Percentile Latency" },
      { abbr: "a11y",       full: "Accessibility (a11y = 11 letters between 'a' and 'y')" },
      { abbr: "i18n",       full: "Internationalization (18 letters between 'i' and 'n')" },
    ],
  },
];

export const GLOSSARY_ID = "$glossary";
