# Search-Highlight Virtualization — Standalone Demo

Tiny Vite + React + TypeScript app demonstrating **viewport-virtualized search highlighting** for long documents — only paragraphs currently in view render highlight overlays in the DOM. Search engine and "N of M" counter unaffected; only *rendering* virtualized.

Page generates 2000 fake JavaScript-tutorial-style paragraphs on load. Sticky toolbar exposes search box, prev/next, options, and — most importantly — an **A/B "Virtualize ON/OFF" toggle** so you can flip the optimisation on and off live and watch contrast.

## Run

```bash
pnpm install
pnpm dev
# open http://localhost:5173
```

Build:

```bash
pnpm build       # type-check + production bundle
pnpm preview     # serve built bundle
```

## The A/B moment

1. Type common word like `function` in the **Find** box.
2. Look at stats badge: `Overlay nodes: ~150` (virtualize ON, default).
3. Flip toggle to **OFF**. Count jumps to several thousand and page briefly stalls.
4. Scroll in OFF mode — perceptibly slower.
5. Flip back to **ON** — instant.

For *real* contrast, push paragraph count to **10000** and repeat. OFF mode visibly stalls for seconds; ON mode same as on 2000 paragraphs.

## Architecture

File names + symbols mirror production plan 1:1:

- `src/stores/visibleStore.ts` — `Set<number>` of paragraph indices in viewport (zustand + immer + shallow).
- `src/hooks/useVisibleParagraphsObserver.ts` — single `IntersectionObserver` on scroll root, RAF-coalesced.
- `src/search/renderHighlights.ts` + `src/search/reconcileHighlights.ts` — pure DOM ops; reconcile diffs prev/next visible set, adds/removes overlay `<div>`s by `data-pg` attribute.
- `src/hooks/useSearchEffect.ts` — orchestration; subscribes to `(currentMatches, visible, virtualizeOn, currentIndex, forceRerender)` and calls reconcile.

## Layout

```
src/
  components/      Toolbar, BlogViewer, Paragraph
  data/            paragraph generator
  hooks/           debounced search, search effect, visibility observer, resize, frame stats
  search/          search engine, rect computation, overlay reconciliation + render
  stores/          paragraphStore, searchStore, visibleStore
  constants.ts     DOM ids, limits, debounce
  types.ts         Paragraph, MatchEntry, SearchOptions
```

## Known limitation — main-thread scan

`findAllMatches` runs on the main thread. With **20,000 paragraphs** and a hot regex it can introduce a sub-second pause during typing on slower hardware. Debounce (200ms) + stale-result discard keep typing responsive, but the scan itself is not offloaded.

Why not a Web Worker: keeping the implementation single-file and dependency-free matters more for this demo than the last ~100ms at the extreme. Move to a worker if you fork this for a real product.

## What this demo deliberately does NOT do

- No rich-text editor / no `contentEditable` — paragraphs read-only `<p>`.
- No replace / multi-paragraph search / pagination — single keyword only.
- No persisted state, no router, no UI framework.
- No tests gating build — demo verified by visual smoke (see "The A/B moment" above).
