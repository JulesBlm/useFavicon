# Changelog

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
