# Count-Min Sketch

## Concept

- **Count-Min Sketch** is a space-efficient, probabilistic data structure used to estimate the frequency of events in a high-velocity stream of data.
- While a traditional Hash Map tracks exact counts of every unique key (which consumes memory that scales linearly with the number of unique items), a Count-Min Sketch uses a **fixed, constant memory footprint** regardless of the volume of data.
- Under the hood, a Count-Min Sketch consists of:
  - A 2D array of counters with depth $d$ (rows) and width $w$ (columns).
  - $d$ independent hash functions ($h_1, h_2, \dots, h_d$) that map input keys to columns in the range $[0, w-1]$.

```mermaid
grid-layout
```
*(Note: Represented below as a structured flow showing row increments)*

```mermaid
flowchart TD
    Key[Key: IP '192.168.1.1'] -->|Hash 1| Row0[Row 0, Col 3]
    Key -->|Hash 2| Row1[Row 1, Col 7]
    Key -->|Hash 3| Row2[Row 2, Col 1]
    
    subgraph Counter Grid
        direction TB
        R0[Row 0: [0] [0] [0] [12+1] [0] [0]]
        R1[Row 1: [0] [0] [0] [0] [0] [0] [0] [8+1] [0]]
        R2[Row 2: [0] [4+1] [0] [0] [0] [0]]
    end
    
    Row0 --> R0
    Row1 --> R1
    Row2 --> R2
```

### Operations

1. **Insert (Update)**:
   - For each row $i$ (from $0$ to $d-1$):
     - Calculate the column index: $c = h_i(\text{key})$.
     - Increment the counter at index `grid[i][c]` by $1$.
2. **Query (Estimate)**:
   - For each row $i$, retrieve the counter: `val = grid[i][h_i(key)]`.
   - The estimated frequency is the **minimum value** found among all retrieved counters:
     $$\text{estimate} = \min_{i} \left(\text{grid}[i][h_i(\text{key})]\right)$$

### Why the Minimum?

- Because multiple keys can map to the same column in a row (hash collision), counters can be artificially inflated by other keys. The sketch **never underestimates** the true count; it can only **overestimate**.
- Since collisions in different rows are independent, taking the minimum value across all rows minimizes the probability that all counters checked were inflated by the same high-frequency elements.

## Problem It Solves

- **Heavy Hitters / Top-K Identification**: Finding the most popular items (trending hashtags, top-selling products, most clicked ads) in real-time streams without storing all unique keys.
- **Network Traffic Monitoring**: Detecting network flow violations, port scans, or DDoS attacks on routers with hardware memory constraints.

## Trade-offs

- **Pros**:
  - **Constant Space Complexity**: Uses $O(w \times d)$ space, which is sized before start and never grows, protecting systems from running out of memory.
  - **Constant Time Complexity**: Inserts and queries are $O(d)$ (extremely fast).
- **Cons**:
  - **Overestimation Bias**: High-frequency items pollute the columns. Low-frequency items that collide with "heavy hitters" receive heavily inflated estimates.
  - **No Count Decrement**: Standard Count-Min sketches do not support decrements. If you decrement a counter, you may corrupt the counts of other items that collided with it.
  - **Mathematical tuning**: To get an error margin within $\epsilon$ with probability $1 - \delta$, you must size the grid:
    $$w = \lceil e/\epsilon \rceil, \quad d = \lceil \ln(1/\delta) \rceil$$

## Examples

- **DDoS Prevention**: System records incoming requests by client IP. If the estimated count in the Count-Min Sketch exceeds 1000/sec, the IP is throttled.
- **Caffeine Cache (TinyLFU)**: Caffeine (a high-performance Java cache library) uses a 4-bit Count-Min Sketch to track how often items are accessed. When the cache is full, it compares the access frequency of the new item against the eviction candidate using the sketch, keeping only the most active items.
- **Trending Hashtags**: Combines a Count-Min Sketch with a Min-Heap of size $K$. When an item's count in the sketch exceeds the root of the heap, it enters the heap, maintaining the active Top-K list.
- **Interview framing**:
  - When asked to identify trending items or rate-limit IPs over high-throughput streams: *"To estimate event frequencies without running out of memory, I will implement a **Count-Min Sketch** linked to a **Min-Heap** of size $K$ to solve the Top-K problem. By choosing a grid width ($w$) based on our error margin ($\epsilon$) and depth ($d$) based on confidence ($\delta$), we limit memory to a small, constant footprint. I will handle overestimation by taking the minimum counter value across our hash functions, ensuring we protect our system from collisions."*
