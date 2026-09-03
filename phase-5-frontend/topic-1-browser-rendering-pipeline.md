# Browser Rendering Pipeline

## Concept

- The **Browser Rendering Pipeline** is the sequence of stages a browser's rendering engine (Blink, WebKit, Gecko) executes to convert raw HTML, CSS, and JavaScript into interactive pixels on screen.
- Understanding this pipeline is the cornerstone of frontend performance and smooth 60fps / 120fps animations, because different operations trigger different entry points in the pipeline.
- A useful mental model divides the pipeline into six stages, although browser engines may combine, parallelize, or skip work:
  1. **DOM Construction**: HTML parser tokens are turned into nodes forming the Document Object Model tree. HTML parsing is incremental and streaming.
  2. **CSSOM Construction**: CSS rules are parsed into the CSS Object Model. Stylesheets needed by the current document are render-blocking because the browser needs the applicable cascade before it can render correctly.
  3. **Render Tree Generation**: The DOM and CSSOM are combined. Only visible elements (`display: none` is omitted; `visibility: hidden` is included) and their computed styles are attached to render tree nodes.
  4. **Layout (Reflow)**: Computes the exact geometric coordinates and bounding box dimensions (width, height, position) for each node relative to the viewport.
  5. **Paint and Rasterization**: Paint creates ordered drawing commands for text, colors, borders, shadows, and images; rasterization turns those commands into pixel tiles.
  6. **Compositing**: Assembles rasterized layers in the correct stacking order and submits the frame for display.

```mermaid
flowchart LR
    HTML[HTML] --> DOM[DOM Tree]
    CSS[CSS] --> CSSOM[CSSOM Tree]
    DOM --> RT[Render Tree]
    CSSOM --> RT
    RT --> Layout["Layout (Reflow)<br/>Geometry & Position"]
    Layout --> Paint["Paint (Raster)<br/>Draw pixels & colors"]
    Paint --> Composite["Composite<br/>GPU Layer Stacking"]
    Composite --> Screen([Display Screen])
```

## Problem It Solves

- Provides an efficient, deterministic abstraction for displaying dynamic hypermedia across diverse hardware and screen resolutions.
- Separates geometric calculation (Layout) from pixel rasterization (Paint) and GPU composition (Composite), allowing browsers to optimize updates: if only colors change, layout is skipped; if only transforms/opacity change, both layout and paint are skipped.

## Trade-offs

- **Layout Thrashing (Forced Synchronous Layout)**:
  - Reading geometric properties (`offsetWidth`, `clientHeight`, `scrollTop`, `getBoundingClientRect()`) right after writing styles forces the browser to run layout prematurely before batching, plummeting frame rates from 60fps to under 10fps.
- **Paint Invalidation Cost**:
  - Changing properties like `color`, `background-color`, or `box-shadow` skips layout but triggers paint. Repainting large regions or complex effects (blurs, gradients) spikes CPU/GPU rasterization times.
- **Compositing vs. Memory Use**:
  - Promoting an element to a compositor layer can avoid layout and paint for suitable animations. However, layer promotion consumes memory and adds management and rasterization costs; excessive promotion can degrade performance, especially on low-end devices.
- **Single Main Thread Bottleneck**:
  - DOM parsing, style calculation, layout, paint, and JavaScript execution all share the browser's **Main Thread**. Long-running JS tasks block layout updates and user interactions (directly degrading INP / Interaction to Next Paint).

## Examples

- **Hardware-Accelerated Animation (Compositor-Only)**
  - Animating `transform` and `opacity` can often bypass Layout and Paint once the element is on a suitable compositor layer. This improves the chance of smooth animation, but does not guarantee it: rasterization, memory pressure, other main-thread work, and device limits still matter.
- **Forced Synchronous Layout Trap**
  - Iterating over elements and reading `el.offsetWidth` while modifying `el.style.width` forces layout computation inside each iteration loop:
    ```javascript
    // BAD: Layout thrashing (forces layout N times)
    elements.forEach(el => {
      const w = el.offsetWidth;
      el.style.width = (w + 10) + 'px';
    });

    // GOOD: Batch reads first, then batch writes
    const widths = elements.map(el => el.offsetWidth);
    elements.forEach((el, i) => {
      el.style.width = (widths[i] + 10) + 'px';
    });
    ```
- **Layer Promotion with `will-change`**
  - Using `will-change: transform` shortly before animating an off-canvas drawer gives the browser a hint to prepare for that change. Remove it after the animation and confirm the benefit with profiling rather than applying it globally.
- **Interview Framing**
  - Explain the usual invalidation paths rather than treating **Layout > Paint > Composite** as a universal cost formula. Geometry changes such as `width`, `margin`, and `top` commonly require Layout + Paint + Composite; visual changes such as `color` and `background` commonly require Paint + Composite; `transform` and `opacity` can often use a compositor-only path. Validate the real bottleneck with browser performance traces, paint flashing, and Core Web Vitals.
