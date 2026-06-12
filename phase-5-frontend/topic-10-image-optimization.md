# Image Optimization

## Concept

- Images are usually the **largest contributor to page weight** and a primary driver of LCP. Image optimization minimizes their bytes and load impact without sacrificing visual quality.
- The main levers:
  - **Modern formats** — serve **AVIF** or **WebP** (far smaller than JPEG/PNG at equal quality) with fallbacks.
  - **Responsive images** — serve appropriately-sized images per device via `srcset`/`sizes` so phones don't download desktop-sized files.
  - **Compression** — lossy/lossless compression tuned to acceptable quality; strip metadata.
  - **Dimensions & CLS** — always specify `width`/`height` (or aspect-ratio) to reserve space and prevent layout shift.
  - **Lazy loading** below-the-fold; **eager/preload** the LCP image (topic 9).
  - **CDN image services** — on-the-fly resizing/format negotiation/optimization at the edge.

```mermaid
flowchart LR
    SRC[Original image] --> CDN[Image CDN: resize +<br/>format (AVIF/WebP) + compress]
    CDN -->|"srcset per device"| DEV[Right-sized image]
    DEV --> LCP[Better LCP, less data]
```

## Problem It Solves

- **Cuts the biggest bytes** — images often dominate transfer size; optimizing them yields the largest, easiest performance wins (faster LCP, less bandwidth, lower CDN cost).
- Ensures users on small/slow devices aren't penalized with oversized assets.
- Prevents image-driven layout shift (a top CLS cause).

## Trade-offs

- **Quality vs. size** — aggressive compression and newer formats save bytes but can introduce artifacts; tune quality per image type (photos tolerate more compression than UI/screenshots with text).
- **Format support vs. fallbacks** — AVIF compresses best but encodes slowly and has slightly less universal support; use `<picture>` with AVIF → WebP → JPEG fallbacks, adding markup complexity.
- **Responsive complexity** — `srcset`/`sizes` and generating multiple sizes adds build/tooling work (usually automated by an image CDN or framework `<Image>` component).
- **CDN cost vs. build-time** — on-the-fly image CDNs are flexible but cost per transform; build-time generation is cheaper but less dynamic.

## Examples

- **Responsive `<picture>`**
  - `<picture><source type="image/avif" srcset="...">​<source type="image/webp" srcset="...">​<img src="fallback.jpg" width height loading="lazy"></picture>` serves the best format the browser supports at the right size.
- **Framework image component**
  - Next.js/Nuxt `<Image>` auto-generates sizes, lazy-loads, serves modern formats, and reserves dimensions — the optimizations bundled.
- **Image CDN**
  - Cloudinary/imgix/Cloudflare Images resize and re-format per request based on device and `Accept` headers, with edge caching.
- **LCP image preload**
  - The hero image is preloaded (`<link rel=preload as=image>` with `imagesrcset`) and eager-loaded so it's not delayed by CSS discovery.
- **Interview framing**
  - For page-weight/LCP problems, lead with images: modern formats (AVIF/WebP), responsive `srcset`, compression, reserved dimensions, lazy-load below-fold + preload the LCP image, served via an image CDN. Since images are usually the dominant bytes, this is the highest-ROI performance answer.
