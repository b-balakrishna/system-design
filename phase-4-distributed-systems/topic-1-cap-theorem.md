# CAP Theorem

## Concept

- **CAP Theorem** (Brewer's Theorem) states that a distributed data store can simultaneously provide at most two of the following three guarantees:
  - **Consistency (C)**: Every read receives the most recent write or an error. This is equivalent to **linearizability** (Phase 4, topic 3) — the system behaves as if there is only a single copy of the data.
  - **Availability (A)**: Every non-failing node returns a non-error response for every request, without any guarantee that it contains the most recent write.
  - **Partition Tolerance (P)**: The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.
- In any distributed system over a physical network, network partitions (dropped/delayed packets, fiber cuts) are inevitable. Therefore, **we cannot choose CA** (Consistency + Availability) in practice.
- When a partition occurs, the system must choose between:
  - **CP (Consistency / Partition tolerance)**: Reject writes or delay reads on isolated partitions to ensure data is consistent, reducing availability.
  - **AP (Availability / Partition tolerance)**: Accept reads and writes on isolated partitions, ensuring availability but allowing temporary data divergence.

```mermaid
flowchart TD
    subgraph Network Partition
        NodeA[Node A - Leader] -. x . - NodeB[Node B - Isolated]
    end
    ClientA[Client A] -->|1. Write key=value2| NodeA
    ClientB[Client B] -->|2. Read key| NodeB
    
    classDef cp fill:#f9d,stroke:#333,stroke-width:2px;
    classDef ap fill:#bfb,stroke:#333,stroke-width:2px;
    
    NodeA ::: cp
    NodeB ::: ap
    
    noteA["CP: Node A rejects or stalls write\nbecause it cannot replicate to Node B"]
    noteB["AP: Node B returns stale 'value1'\nto maintain availability"]
```

## Problem It Solves

- **Defines physical limits**: CAP Theorem stops engineers from chasing the "perfect database" that is 100% available, globally replicated, and instantly consistent.
- **Architectural guide**: Forces systems architects to design explicit trade-offs based on the business domain (e.g., banking favors CP, while social media feeds favor AP).

## Trade-offs

- **CP (Consistency + Partition Tolerance)**:
  - **Pros**: Read consistency is guaranteed. No stale reads or conflicting updates. Simple application logic since the database behaves like a single-node system.
  - **Cons**: High latency during minor network anomalies; complete write/read failure if a majority partition cannot be reached.
- **AP (Availability + Partition Tolerance)**:
  - **Pros**: Extremely low latency (local writes). High resilience; the system remains functional even if nodes are completely disconnected.
  - **Cons**: Read operations return stale data. Writes can diverge, requiring complex conflict resolution mechanisms (LWW, CRDTs, or application-level merges).
- **The CA Fallacy**: Under normal operations (no partitions), a system can be both consistent and available. The CAP choice is *only active* when the network partitions.

## Examples

- **CP Systems**:
  - **ZooKeeper / etcd / Consul**: Use consensus protocols (Paxos/Raft) where updates require a quorum. If a partition divides the cluster, the minority partition shuts down or rejects writes, preferring consistency over availability.
  - **Traditional Relational Databases with synchronous replication**: If the replica is unreachable, the write blocks.
- **AP Systems**:
  - **Apache Cassandra / DynamoDB (default configuration)**: Write and read operations can configure replica levels (e.g., `LOCAL_ONE`) to guarantee success even if most replicas are partitioned.
  - **CouchDB**: Designed for disconnected, offline-first operation.
- **Interview framing**:
  - When an interviewer asks about CAP, immediately correct the common misconception: **"You cannot choose CA."** The network is inherently partitionable. The real choice is strictly: **"When a partition happens, do we block/error (CP) or do we return stale/divergent data (AP)?"** Follow this up by introducing **PACELC** (topic 2) to show you understand how the system behaves under normal, non-partitioned operations.
