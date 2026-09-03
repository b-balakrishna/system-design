export const CHEATSHEET_ID = "__cheatsheet__";

export default function CheatSheet() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-text">
          Interview Reference Card
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          System Design Numbers & Cheat Sheet
        </h1>
        <p className="mt-2 text-ink-soft">
          Essential latency numbers, powers of two, database limits, and availability metrics for back-of-the-envelope calculations.
        </p>
      </div>

      {/* Latency Numbers */}
      <section className="rounded-xl border border-line bg-elev p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-ink">
          1. Latency Numbers Every Systems Engineer Should Know
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase text-ink-soft">
                <th className="py-2.5 pr-4">Operation</th>
                <th className="py-2.5 pr-4">Latency (Real Time)</th>
                <th className="py-2.5">Human Scale (1 ns = 1 sec)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              <tr>
                <td className="py-2.5 pr-4 font-medium">L1 Cache Reference</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">0.5 ns</td>
                <td className="py-2.5 text-ink-soft">0.5 second</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Branch Mispredict</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">5 ns</td>
                <td className="py-2.5 text-ink-soft">5 seconds</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">L2 Cache Reference</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">7 ns</td>
                <td className="py-2.5 text-ink-soft">7 seconds</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Mutex Lock / Unlock</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">25 ns</td>
                <td className="py-2.5 text-ink-soft">25 seconds</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Main Memory Reference (RAM)</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">100 ns</td>
                <td className="py-2.5 text-ink-soft">1.7 minutes</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Compress 1 KB with Zstandard / Snappy</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">2-3 µs</td>
                <td className="py-2.5 text-ink-soft">50 minutes</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Send 2 KB over 1 Gbps Network</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">20 µs</td>
                <td className="py-2.5 text-ink-soft">5.5 hours</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Read 1 MB sequentially from RAM</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">250 µs</td>
                <td className="py-2.5 text-ink-soft">3 days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">NVMe SSD Random Read</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">150 µs</td>
                <td className="py-2.5 text-ink-soft">1.7 days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Read 1 MB sequentially from NVMe SSD</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">1 ms</td>
                <td className="py-2.5 text-ink-soft">12 days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Same Datacenter Round-Trip (LAN RTT)</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">0.5 ms</td>
                <td className="py-2.5 text-ink-soft">6 days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">HDD Random Seek</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">10 ms</td>
                <td className="py-2.5 text-ink-soft">4 months</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Read 1 MB sequentially from HDD</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">20 ms</td>
                <td className="py-2.5 text-ink-soft">8 months</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Cross-Country RTT (US East to West)</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">60 ms</td>
                <td className="py-2.5 text-ink-soft">2 years</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium">Transatlantic RTT (US to Europe)</td>
                <td className="py-2.5 pr-4 font-mono text-brand-text">150 ms</td>
                <td className="py-2.5 text-ink-soft">5 years</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Powers of Two */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-elev p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">
            2. Powers of Two & Data Sizes
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase text-ink-soft">
                <th className="py-2 pr-3">Power</th>
                <th className="py-2 pr-3">Exact Value</th>
                <th className="py-2">Approximate Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono text-xs">
              <tr><td className="py-2 pr-3">2^10</td><td className="py-2 pr-3">1,024</td><td className="py-2 text-brand-text">1 KB (Kilobyte)</td></tr>
              <tr><td className="py-2 pr-3">2^20</td><td className="py-2 pr-3">1,048,576</td><td className="py-2 text-brand-text">1 MB (Megabyte)</td></tr>
              <tr><td className="py-2 pr-3">2^30</td><td className="py-2 pr-3">1,073,741,824</td><td className="py-2 text-brand-text">1 GB (Gigabyte)</td></tr>
              <tr><td className="py-2 pr-3">2^40</td><td className="py-2 pr-3">1,099,511,627,776</td><td className="py-2 text-brand-text">1 TB (Terabyte)</td></tr>
              <tr><td className="py-2 pr-3">2^50</td><td className="py-2 pr-3">1,125,899,906,842,624</td><td className="py-2 text-brand-text">1 PB (Petabyte)</td></tr>
              <tr><td className="py-2 pr-3">2^64</td><td className="py-2 pr-3">18.4 Quintillion</td><td className="py-2 text-brand-text">Snowflake ID Space</td></tr>
            </tbody>
          </table>
        </div>

        {/* Availability 9s */}
        <div className="rounded-xl border border-line bg-elev p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">
            3. High Availability (The Nines)
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase text-ink-soft">
                <th className="py-2 pr-3">SLA / SLO</th>
                <th className="py-2 pr-3">Downtime / Year</th>
                <th className="py-2">Downtime / Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono text-xs">
              <tr><td className="py-2 pr-3 font-semibold">99% (Two 9s)</td><td className="py-2 pr-3">3.65 days</td><td className="py-2 text-amber-500">14.4 mins</td></tr>
              <tr><td className="py-2 pr-3 font-semibold">99.9% (Three 9s)</td><td className="py-2 pr-3">8.76 hours</td><td className="py-2 text-amber-500">1.44 mins</td></tr>
              <tr><td className="py-2 pr-3 font-semibold">99.99% (Four 9s)</td><td className="py-2 pr-3">52.6 minutes</td><td className="py-2 text-emerald-500">8.64 secs</td></tr>
              <tr><td className="py-2 pr-3 font-semibold">99.999% (Five 9s)</td><td className="py-2 pr-3">5.26 minutes</td><td className="py-2 text-emerald-500">0.86 secs</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Production Throughput Rules of Thumb */}
      <section className="rounded-xl border border-line bg-elev p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-ink">
          4. Production Hardware & Throughput Rules of Thumb
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div className="rounded-lg border border-line bg-sunk/50 p-4">
            <div className="font-semibold text-brand-text">Redis / In-Memory Cache</div>
            <div className="mt-1 text-2xl font-bold text-ink">~100k QPS</div>
            <p className="mt-1 text-xs text-ink-soft">Per single-threaded core. Sub-millisecond latency. Bounded by memory and network I/O.</p>
          </div>

          <div className="rounded-lg border border-line bg-sunk/50 p-4">
            <div className="font-semibold text-brand-text">Relational DB (Postgres/MySQL)</div>
            <div className="mt-1 text-2xl font-bold text-ink">~1k-5k Writes/s</div>
            <p className="mt-1 text-xs text-ink-soft">Indexed writes with WAL. Reads: ~10k-20k QPS on indexed primary keys with connection pooling.</p>
          </div>

          <div className="rounded-lg border border-line bg-sunk/50 p-4">
            <div className="font-semibold text-brand-text">Kafka Message Broker</div>
            <div className="mt-1 text-2xl font-bold text-ink">~100k-500k Msgs/s</div>
            <p className="mt-1 text-xs text-ink-soft">Per broker partition via zero-copy sequential disk I/O and OS page cache batching.</p>
          </div>

          <div className="rounded-lg border border-line bg-sunk/50 p-4">
            <div className="font-semibold text-brand-text">WebSocket Gateway Server</div>
            <div className="mt-1 text-2xl font-bold text-ink">~50k-100k Conns</div>
            <p className="mt-1 text-xs text-ink-soft">Per server node with tuned Linux TCP buffers and max open file limits (ulimit -n 1000000).</p>
          </div>

          <div className="rounded-lg border border-line bg-sunk/50 p-4">
            <div className="font-semibold text-brand-text">Network Interface (1 Gbps)</div>
            <div className="mt-1 text-2xl font-bold text-ink">~125 MB/s</div>
            <p className="mt-1 text-xs text-ink-soft">Theoretical maximum throughput. A 10 Gbps card provides ~1.25 GB/s maximum line rate.</p>
          </div>

          <div className="rounded-lg border border-line bg-sunk/50 p-4">
            <div className="font-semibold text-brand-text">Seconds in a Day</div>
            <div className="mt-1 text-2xl font-bold text-ink">86,400 sec</div>
            <p className="mt-1 text-xs text-ink-soft">Shortcut: 1 million requests/day ≈ 12 QPS. 100 million requests/day ≈ 1,160 QPS.</p>
          </div>
        </div>
      </section>

      {/* Reading & Notation Conventions */}
      <section className="rounded-xl border border-line bg-elev p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-ink">
          5. Reading Conventions & Architecture Notations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase text-ink-soft">
                <th className="py-2.5 pr-4">Symbol / Notation</th>
                <th className="py-2.5 pr-4">Context</th>
                <th className="py-2.5">Meaning & Visual Rendering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              <tr>
                <td className="py-2.5 pr-4 font-mono font-bold text-brand-text">name$</td>
                <td className="py-2.5 pr-4 font-medium text-ink">Mermaid UML Class Diagrams</td>
                <td className="py-2.5 text-ink-soft">
                  <strong>Static member</strong>. Suffix <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">$</code> tells Mermaid to render the method or property underlined per UML standards (e.g. <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">+getInstance()$</code>).
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-bold text-brand-text">+ / - / #</td>
                <td className="py-2.5 pr-4 font-medium text-ink">Mermaid UML Class Diagrams</td>
                <td className="py-2.5 text-ink-soft">
                  <strong>Visibility modifiers</strong>: <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">+</code> Public, <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">-</code> Private, <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">#</code> Protected, <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">~</code> Package.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-bold text-brand-text">$ ... $</td>
                <td className="py-2.5 pr-4 font-medium text-ink">Technical Notes & Algorithms</td>
                <td className="py-2.5 text-ink-soft">
                  <strong>Inline LaTeX math</strong>. Delimits mathematical variables, formulas, and Big-O notation (e.g. <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">$O(1)$</code>, <code className="rounded bg-sunk px-1 py-0.5 font-mono text-xs">$N=3$</code>).
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-bold text-brand-text">$$ ... $$</td>
                <td className="py-2.5 pr-4 font-medium text-ink">Capacity Estimations</td>
                <td className="py-2.5 text-ink-soft">
                  <strong>Display equation block</strong>. Delimits multi-line capacity estimation math, bandwidth calculations, and storage formulas.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-bold text-brand-text">$ / $$ / $$$</td>
                <td className="py-2.5 pr-4 font-medium text-ink">Proximity Service (Yelp / Maps)</td>
                <td className="py-2.5 text-ink-soft">
                  <strong>Hospitality price tier</strong> ratings ($ = budget, $$ = moderate, $$$ = upscale).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
