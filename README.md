# react-usefavicon

[![npm version](https://badge.fury.io/js/react-usefavicon.svg)](https://www.npmjs.com/package/react-usefavicon)

[Check a live demo here](https://jules.engineer/usefavicon/)

react-usefavicon is a React hook to dynamically draw on your favicon. Composite badges, text bubbles, progress indicators, or anything you can draw on a canvas onto your existing favicon. This is useful to notify the user of changes or progress, especially if these are long running and the user is expected to switch tabs. GitHub ([read more](https://joelcalifa.com/blog/tiny-wins/)), Slack, and many more websites use this technique.

**Works with modern React frameworks**: Next.js (App Router & Pages Router), React Router, TanStack Router, Remix, and more. Fully SSR-safe!

> **React 19 note**: If you just need to set a static favicon URL, React 19 supports rendering `<link rel="icon" href={href} />` directly in your components — React will hoist it to `<head>` for you. This hook is most valuable when you need to **draw on** the favicon using canvas (badges, overlays, dynamic text).

## Installing

If you use npm

```bash
npm install react-usefavicon
```

For yarn

```bash
yarn add react-usefavicon
```

## Usage

```js
import { useFavicon, emojiSvg } from "react-usefavicon";

const { drawOnFavicon, restoreFavicon, setFaviconHref, svgToFavicon } = useFavicon();
```

Returns an object of stable handler functions.

### Draw on the favicon

Draw anything on top of the current favicon using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). The current favicon is drawn as the background first, then your callback runs on top.

```jsx
import { useFavicon, drawCircle, drawTextBubble } from "react-usefavicon";

function Notifications({ count }) {
  const { drawOnFavicon, restoreFavicon } = useFavicon();

  useEffect(() => {
    if (count > 0) {
      drawOnFavicon(drawCircle, { fillColor: "red", radius: 40, x: 200, y: 200 });
    } else {
      restoreFavicon();
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

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `faviconSize` | `number` | `256` | Canvas size in px |
| `clear` | `boolean` | `false` | Start with a blank canvas instead of drawing over the current favicon |
| `...rest` | `any` | — | Passed through as the third argument to your draw callback |

If you call `drawOnFavicon` multiple times, drawings stack. Call `restoreFavicon()` first to draw on the clean original.

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

All options have sensible defaults — you can call `drawOnFavicon(drawCircle)` with no options for a red dot in the bottom-right corner.

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

```jsx
await svgToFavicon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="tomato" />
  </svg>
);
```

This dynamically imports `react-dom/server` to render the SVG to a string. Only `<svg>` elements are accepted.

### Restore the original favicon

```jsx
restoreFavicon();
```

Resets the favicon to whatever it was when the hook first mounted.

## SSR

The hook is SSR-safe — it no-ops on the server and updates the favicon after hydration. In Next.js App Router, mark the component with `'use client'`.

## Credits & Inspiration

- [Joel Califa: Tiny Wins](https://joelcalifa.com/blog/tiny-wins/)
- [CSS Tricks: Emojis as Favicons](https://css-tricks.com/emojis-as-favicons/)
- [svg-crowbar](https://github.com/cy6erskunk/svg-crowbar/)
- [MDN Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [favicon-badge](https://glitch.com/edit/#!/favicon-badge?path=script.js%3A1%3A14)
- [Tinycon](https://github.com/tommoor/tinycon/blob/master/tinycon.js)
- [react-favicon](https://github.com/oflisback/react-favicon)

## Ideas

- [Dark mode for SVG favicon with `prefers-color-scheme`](https://blog.tomayac.com/2019/09/21/prefers-color-scheme-in-svg-favicons-for-dark-mode-icons/)
