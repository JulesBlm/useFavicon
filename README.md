# react-usefavicon

[![npm version](https://badge.fury.io/js/react-usefavicon.svg)](https://www.npmjs.com/package/react-usefavicon)

[Check a live demo here](https://jules.engineer/usefavicon/)

react-usefavicon is a a React.js hook to control the favicon. Use it to update the favicon with a url, base64 encoded image or an emoji in an SVG. Draw anything on top of the favicon, badges, text, checkmarks, anything! This is useful to notify the user of changes or progress, especially if these are long running and the user is expected to switch tabs. GitHub ([read more](https://joelcalifa.com/blog/tiny-wins/)), Netlify and Slack and many more websites do this to and strangely I couldn't find a React hook for it, so I made my own.

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

```javascript
import { useFavicon } from "react-usefavicon";

function App() {
  const [
    faviconHref,
    {
      restoreFavicon,
      drawOnFavicon,
      setEmojiFavicon,
      setFaviconHref,
      jsxToFavicon,
    },
  ] = useFavicon();
}
```

The hook returns an array containing `faviconHref` and an object of setter functions.

- `faviconHref` the current href string of the favicon link element

The setters object contains the following functions

- `restoreFavicon()` a function to reset the favicon to whatever it was on mount

- `drawFavicon(drawCallback, [{ options }]}` creates a canvas, copies the current favicon to it and calls `drawCallback`.

  - `drawCallback` (required) is a user-supplied function takes in a newly created [canvas context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D), which you can draw anything on with the [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage). So whatever you can draw on `<canvas>`, you can put it on your favicon!
  - `options` object (optional) with two configurable properties.
    - `faviconSize` to set the size of the canvas. Default is `256` px
    - `clear` boolean to start with a blank canvas instead of the favicon. Default is `false`
    - `...props` all other props in the options object are passed on to `drawCallback`.

  Note: If you call `drawFavicon` multiple times in successsion, the drawings will stack on top of each other. Simply call `restoreFavicon` before calling `drawFavicon` again to ensure you're drawing on the clean, original favicon.

- `setFaviconHref(href)` a function to set the href of the favicon tag manually, for example to switch to another static favicon image.

- `setEmojiFavicon(emoji)` a function to set the favicon to an emoji. Technically, you can use any character, just know that most text characters don't work as well as emoji's as favicons.

- `jsxToFavicon(SvgEl)` a function that takes in an SVG React Element, renders it to a string and sets it as the favicon. Only SVG-type React elements are allowed!

## Draw functions

Draw functions take three parameters: a `context` object, `faviconSize`, and a `props` object.

Three simple canvas draw functions are included: `drawCircle`, `drawSquare`, and `drawTextBubble`,

## Credits & Inspiration

- [Joel Califa: Tiny Wins](https://joelcalifa.com/blog/tiny-wins/)
- [CSS Tricks: Emojis as Favicons](https://css-tricks.com/emojis-as-favicons/)
- [svg-crowbar](https://github.com/cy6erskunk/svg-crowbar/)
- [MDN Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [favicon-badge](https://glitch.com/edit/#!/favicon-badge?path=script.js%3A1%3A14)
- [Tinycon](https://github.com/tommoor/tinycon/blob/master/tinycon.js)
- [react-favicon](https://github.com/oflisback/react-favicon)

## Ideas & Loose Ends

- Option to draw on the original favicon, not just the latest
- Not sure if the querySelector always works. What if there are multiple `<link rel="icon">` tags?
- [Dark mode for SVG favicon swith `prefers-color-scheme`](https://blog.tomayac.com/2019/09/21/prefers-color-scheme-in-svg-favicons-for-dark-mode-icons/)
- Tests with jest
