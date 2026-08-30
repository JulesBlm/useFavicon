# Changelog

## 3.0.0

30-08-2026

> Includes everything since 2.0.0 — version 2.1.0 was tagged in git but never published to npm, so its changes ship here.

### Breaking changes

- **ESM-only** — the CJS build is gone. The package ships a single ES module (`dist/index.js`) with an `import`-only exports map. CJS `require()` consumers must migrate to `import` (or dynamic `import()`).

- **Named export only** — the default export is removed:

  ```diff
  - import useFavicon from "react-usefavicon";
  + import { useFavicon } from "react-usefavicon";
  ```

- **`svgToFavicon` reshaped into the standalone `svgToDataUri`** — no longer a hook handler; it's a pure utility that returns a `data:` URI string, composing with `setFaviconHref` or React 19's declarative `<link rel="icon" href={uri} />`:

  ```diff
  - const { svgToFavicon } = useFavicon();
  - await svgToFavicon(<svg>…</svg>);
  + const { setFaviconHref } = useFavicon();
  + setFaviconHref(await svgToDataUri(<svg>…</svg>));
  ```

  It now accepts any element that *renders* an `<svg>` root, so icon-library components (lucide-react, react-icons) work directly — the old version rejected anything but a literal `<svg>` element. Serialization uses `react-dom/client` in a detached root instead of `react-dom/server`, and the `xmlns` attribute is added automatically, so JSX may omit it.

- **`react-dom` is now an optional peer dependency** — only needed if you call `svgToDataUri`, and loaded on demand when you do.

- **Restore baseline is shared and adaptive** — the "original" favicon href is captured once per document and shared by all `useFavicon()` instances, so a component that mounts after another has drawn on the favicon still restores the true original (previously each instance captured its own, restoring a drawn-on icon). If the framework replaces the favicon `<link>` element (e.g. on a route change), the new element's href becomes the new baseline.

- **`drawOnFavicon` no longer rejects when the favicon image fails to load** — a missing, blocked, or CORS-less favicon resolves and draws on a blank canvas instead of rejecting the promise.

- **`DrawOptions` lost its `[key: string]: unknown` index signature** — extra draw options are typed by the generic parameter instead, so option typos are now type errors.

### New

- **Browser-accurate favicon link selection** — with multiple icon links the hook now targets the one the browser displays (SVG-typed preferred, last-in-document-order among equals) instead of the first match. Fixes invisible draws on pages with both an `.ico` and an SVG icon link — including Next.js App Router's default output.
- **`drawOnFavicon` is generic** — `drawOnFavicon<T>(callback, options)` types the options against your custom callback.
- **`textColor` option on `drawTextBubble`** — the label color is configurable (default `"white"`); previously hardcoded.
- **All built-in draw-option fields are optional** — matching the fact that every field has a default; `drawOnFavicon(drawCircle)` with no options is valid TypeScript.
- **`"use client"` banner on the build** — server components importing the hook get a clean client boundary in Next.js App Router.

### Fixed

- **Canvas tainting** — the favicon image loads with `crossOrigin="anonymous"`, so drawing over a CORS-enabled cross-origin favicon no longer throws `SecurityError` from `toDataURL()`.
- **Stray `context.fill()` after `fillRect`** in `drawSquare`, and a duplicate `fillStyle` assignment in `drawTextBubble`.

### Improved

- tsup replaces microbundle for builds
- ESLint 10 flat config, TypeScript 6, jsdom 29; all dependencies current with zero `npm audit` findings
- README: framework guidance (Next.js, React Router, TanStack), a React 19 head-elements section, restore-baseline and promise semantics, and a typed custom-callback example
- v4 direction collected in [V4.md](V4.md) (declarative `useFaviconHref`, WebGL/WebGPU rendering, animation, dark-mode SVGs)
- Removed leftover Babel/Rollup configs and unused `browserslist` from the pre-tsup era

## 2.0.0

31-03-2026

### Breaking changes

- **Return shape changed** — `useFavicon()` now returns an object of handlers instead of `[faviconHref, handlers]`. The favicon href is no longer exposed as reactive state, avoiding unnecessary re-renders in consuming components.

  ```diff
  - const [faviconHref, { drawOnFavicon }] = useFavicon();
  + const { drawOnFavicon } = useFavicon();
  ```

- **`jsxToFavicon` renamed to `svgToFavicon`** — the old name overpromised; it only accepts `<svg>` elements.

- **`setEmojiFavicon` removed from hook** — use the new standalone `emojiSvg` helper with `setFaviconHref` instead:

  ```diff
  - setEmojiFavicon("🔥");
  + setFaviconHref(`data:image/svg+xml,${emojiSvg("🔥")}`);
  ```

- **`drawOnFavicon` now returns a `Promise`** — errors from image decoding are surfaced instead of silently swallowed. Existing fire-and-forget usage still works, but you can now `await` or `.catch()` it.

- **Minimum React version bumped to 18.0.0**

### New

- **`emojiSvg(emoji)` export** — standalone helper that returns a data-URI-ready SVG string. Works with the hook, without it, or in a React 19 `<link rel="icon">`.
- **Draw function option types exported** — `DrawCircleOptions`, `DrawSquareOptions`, `DrawTextBubbleOptions` are now available for TypeScript users.
- **`DrawCallback<T>` is generic** — custom draw callbacks can type their options parameter.

### Fixed

- **Stale closure in `drawOnFavicon`** — rapid calls no longer read outdated favicon href. The current value is read from a ref at call time.
- **Stable handler identity** — all returned functions maintain stable references across renders, preventing unnecessary re-renders in consumers and making them safe to use in effect dependency arrays.

### Improved

- `img.decode()` replaces `onload`/`onerror` callbacks in `drawOnFavicon`
- Named effect functions for better stack traces and React DevTools
- Removed `type="image/x-icon"` from created link elements (we set SVGs and PNGs, not `.ico`)
- Vitest replaces Jest
- Dev dependencies updated to React 19, TypeScript 5.7, Prettier 3
