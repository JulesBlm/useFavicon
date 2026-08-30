# react-usefavicon

[![npm version](https://badge.fury.io/js/react-usefavicon.svg)](https://www.npmjs.com/package/react-usefavicon)

[Check a live demo here](https://jules.engineer/usefavicon/)

react-usefavicon is a React hook to dynamically draw on your favicon. Composite badges, text bubbles, progress indicators, or anything you can draw on a canvas onto your existing favicon. This is useful to notify the user of changes or progress, especially if these are long running and the user is expected to switch tabs. GitHub ([read more](https://joelcalifa.com/blog/tiny-wins/)), Slack, and many more websites use this technique.

**Works with modern React frameworks**: Next.js (App Router & Pages Router), React Router, TanStack Router, Remix, and more. Fully SSR-safe!

> **React 19 note**: If you just need to set a static favicon URL, React 19 supports rendering `<link rel="icon" href={href} />` directly in your components — React will hoist it to `<head>` for you (see [React 19 and head elements](#react-19-and-head-elements)). This hook is most valuable when you need to **draw on** the favicon using canvas (badges, overlays, dynamic text).

## Installing

Requires React 18 or newer.

```bash
npm install react-usefavicon
```

(or `yarn add` / `pnpm add`)

## Usage

```js
import { useFavicon, emojiSvg } from "react-usefavicon";

const { drawOnFavicon, restoreFavicon, setFaviconHref } = useFavicon();
```

Returns an object of stable handler functions.

### Draw on the favicon

Draw anything on top of the current favicon using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). The current favicon is drawn as the background first, then your callback runs on top.

```jsx
import { useEffect } from "react";
import { useFavicon, drawTextBubble } from "react-usefavicon";

function Notifications({ count }) {
  const { drawOnFavicon, restoreFavicon } = useFavicon();

  useEffect(() => {
    // Restore first: drawings stack, so always draw on the clean original
    restoreFavicon();
    if (count > 0) {
      drawOnFavicon(drawTextBubble, { label: String(count) });
    }
  }, [count, drawOnFavicon, restoreFavicon]);

  return <span>{count} notifications</span>;
}
```

Or write your own draw callback. It receives the canvas context, the favicon size, and any extra options you pass:

```jsx
drawOnFavicon((ctx, size) => {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(size - 30, size - 30, 25, 0, Math.PI * 2);
  ctx.fill();
});
```

In TypeScript, custom callbacks are fully typed — declare your options type once and both the callback and the options you pass are checked against it:

```tsx
import type { DrawCallback } from "react-usefavicon";

const drawProgress: DrawCallback<{ fraction: number }> = (ctx, size, { fraction }) => {
  ctx.fillStyle = "dodgerblue";
  ctx.fillRect(0, size - 24, size * fraction, 24);
};

drawOnFavicon(drawProgress, { fraction: 0.6 });
```

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `faviconSize` | `number` | `256` | Canvas size in px |
| `clear` | `boolean` | `false` | Start with a blank canvas instead of drawing over the current favicon |
| `...rest` | `any` | — | Passed through as the third argument to your draw callback |

If you call `drawOnFavicon` multiple times, drawings stack. Call `restoreFavicon()` first to draw on the clean original.

`drawOnFavicon` returns a promise that resolves once the favicon is updated. If the current favicon can't be loaded as the background (missing, or cross-origin without CORS headers), the promise still resolves — your drawing lands on a blank canvas instead of rejecting.

### Built-in draw functions

Three draw helpers are included for common patterns:

```js
import { drawCircle, drawTextBubble, drawSquare } from "react-usefavicon";
```

**`drawCircle`** — draws a filled circle (notification dot)

```jsx
drawOnFavicon(drawCircle, { fillColor: "red", radius: 40, x: 200, y: 200 });
```

**`drawTextBubble`** — draws a rounded badge with a text label (unread count)

```jsx
drawOnFavicon(drawTextBubble, { label: "3", color: "orangered", fontSize: 128, font: "sans-serif" });
```

**`drawSquare`** — draws a filled square

```jsx
drawOnFavicon(drawSquare, { fillColor: "black", length: 50, x: 200, y: 200 });
```

All options have sensible defaults — when you call `drawOnFavicon(drawCircle)` with no options, a red dot appears in the bottom-right corner.

### Set an emoji favicon

`emojiSvg` is a standalone helper — works with the hook or with React 19's `<link>`:

```jsx
setFaviconHref(`data:image/svg+xml,${emojiSvg("🔥")}`);

// or without the hook:
<link rel="icon" href={`data:image/svg+xml,${emojiSvg("🔥")}`} />
```

### Set a favicon URL

```jsx
setFaviconHref("/favicons/active.png");
```

### Render JSX SVG as favicon

`svgToDataUri` is a standalone utility that renders any React element with an `<svg>` root to a data URI. Icon-library components (lucide-react, react-icons, …) work directly, so your favicon can reuse your app's icon system:

```jsx
import { svgToDataUri } from "react-usefavicon";
import { Activity } from "lucide-react";

setFaviconHref(await svgToDataUri(<Activity color="tomato" />));
```

The result is a plain string, so it also pairs with React 19's declarative `<link>` — serialize once and render it, no hook needed. The `xmlns` attribute is added during serialization, so your JSX may omit it. Client-only, and `react-dom` (an optional peer dependency) is loaded on demand the first time you call it.

### Restore the original favicon

```jsx
restoreFavicon();
```

Resets the favicon to its original href.

**What counts as "original":** the favicon's href as it was when the hook *first* touched the favicon — this baseline is shared by all `useFavicon()` instances on the page, so a component that mounts after another component has already drawn on the favicon still restores the true original, not the drawn-on version. If your framework replaces the favicon `<link>` element itself (for example on a route change to a page that defines its own favicon), the hook adopts the new element's href as the new original.

## Usage with frameworks

Your framework declares the *static* favicon; `useFavicon` mutates it at runtime. The two layer cleanly — keep declaring your favicon the way your framework wants, and use the hook for the dynamic states (badges, unread counts, progress) no framework has an API for.

- **Next.js (App Router)** — declare your favicon via the [file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) (`app/favicon.ico`, `app/icon.svg`) or `metadata.icons`. Next often emits *both* an `.ico` and an SVG icon link; the hook targets the link the browser actually displays (preferring the SVG one, as browsers do). Components using the hook are client components (`'use client'`).
- **React Router / Remix** — declare the favicon in your root route's `links` export. Root links persist across client-side navigations, so the hook keeps working as users move around.
- **TanStack Start / Router** — declare the favicon in your root route's `head()`. Same story.

The hook is fully SSR-safe: every handler no-ops on the server, and favicon discovery happens after hydration, so there are no hydration mismatches.

If a client-side navigation replaces the favicon `<link>` element (for example, a route that defines its own icon), the hook adopts the new element and its href becomes the new restore baseline — see [Restore the original favicon](#restore-the-original-favicon).

### React 19 and head elements

React 19 [supports metadata tags natively](https://react.dev/blog/2024/12/05/react-19#support-for-metadata-tags): `<title>`, `<meta>`, and `<link>` rendered anywhere in your component tree are automatically hoisted into `<head>`. This works in client-only apps, streaming SSR, and Server Components, so plain JSX is now a perfectly good way to declare a favicon — including a state-driven one:

```jsx
function App({ status }) {
  return <link rel="icon" href={`/favicons/${status}.svg`} />;
}
```

Two details of [React's `<link>` handling](https://react.dev/reference/react-dom/components/link) matter for this hook:

- **React does not deduplicate icon links.** Only stylesheets with a `precedence` prop get deduplication and load-ordering; `rel="icon"` links are just hoisted. If several components render an icon link — or your framework already declares one — they *all* end up in `<head>`, and the browser picks which to display by its own preference: SVG-typed links first, later links over earlier ones. The hook uses the same selection rule, so it mutates the link the browser is actually showing.
- **A React-rendered icon link is still React's element.** The hook changes its `href` attribute out-of-band, which survives re-renders as long as the link's props stay the same. If you re-render the `<link>` with a different `href` prop, React's value wins and any drawing is overwritten; if the element unmounts, the hook re-discovers the favicon and adopts the replacement as its new restore baseline.

Rule of thumb: render a `<link>` when the whole icon swaps between known URLs, and reach for the hook when you need to read the *current* favicon and composite on top of it — canvas drawing has no declarative equivalent.

## Credits & Inspiration

- [Joel Califa: Tiny Wins](https://joelcalifa.com/blog/tiny-wins/)
- [CSS Tricks: Emojis as Favicons](https://css-tricks.com/emojis-as-favicons/)
- [svg-crowbar](https://github.com/cy6erskunk/svg-crowbar/)
- [MDN Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [favicon-badge](https://glitch.com/edit/#!/favicon-badge?path=script.js%3A1%3A14)
- [Tinycon](https://github.com/tommoor/tinycon/blob/master/tinycon.js)
- [react-favicon](https://github.com/oflisback/react-favicon)

## Ideas

Future directions — a declarative React 19 API, WebGL/WebGPU rendering, animation, dark-mode SVGs — live in [V4.md](V4.md).
