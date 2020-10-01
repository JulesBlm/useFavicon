# useFavicon

[Check a live demo here](https://jules.engineer/usefavicon/)

A React.js hook to control the favicon, update the favicon with a url, base64 encoded image or an emoji in an SVG. Draw anything on top of the favicon, badges, text, checkmarks, anything! This is useful to notify the user of changes or progress. Netlify and Slack and surely many more websites do this to and strangely I couldn't find a React hook for it. So I made my own.

Because React doesn't have access to the favicon tag (`<link rel="icon" href="favicon.svg">`), we use the following attribute selector `link[rel*='icon']` to get it and set it to a [React ref](https://reactjs.org/docs/hooks-reference.html#useref).

# Usage

```javascript
function App() {
  const {
    faviconHref,
    restoreFavicon,
    drawOnFavicon,
    setEmojiFavicon,
    setFaviconHref,
  } = useFavicon();
}
```

The hook returns

<!-- * `favIconRef` a reference to the favicon tag `<link rel="icon" href="...">` -->

- `faviconHref` the current href string of the favicon tag

- `restoreFavicon` resets the favicon to whatever it was on mount

- `drawFavicon` creates a canvas, copies the current favicon to it and calls `drawCallback` which is user supplied function that draws on the canvas. The callback takes in a newly crealy context, which you can use to draw anything on it with the [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). So whatever you can draw on `<canvas>`, you can put it on your favicon! `drawFavicon` takes a config object as it second paramter, to control the size of the favicon `{ faviconSize = 256, clear = false, ...props }`. All other props in the config object are passed on to `drawCallback`. Note: If you call `drawFavicon` multiple times in successsion, the drawings will stack on top of each other. Simply call `restoreFavicon` before calling `drawFavicon` again to ensure you're drawing on the clean, original favicon.

- `setFaviconHref` set the href of the favicon tag manually, for example to switch to another static favicon image.

- `setEmojiFavicon` sets the favicon to an emoji. Technically you can use any text character, just know that they don't work as well as emoji's.

## Credits & Inspiration

- [CSS Tricks: Emojis as Favicons](https://css-tricks.com/emojis-as-favicons/)
<!-- - [The Making of an Animated Favicon](https://css-tricks.com/the-making-of-an-animated-favicon/) -->
- [MDN Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [favicon-badge](https://glitch.com/edit/#!/favicon-badge?path=script.js%3A1%3A14)
- [Tinycon](https://github.com/tommoor/tinycon/blob/master/tinycon.js)
- [react-favicon](https://github.com/oflisback/react-favicon/blob/master/lib/react-favicon.js)

## Ideas & Loose Ends

- drawOnOriginalFavicon option
- What if there are multiple `<link rel="icon">` tags?
- Always need to pass object as argument to `drawFavicon` for it to work, which is not that nice. `drawOnFavicon` and `drawCallback` both need faviconSize
- Chrome browsers with nonstandard zoom report fractional **devicePixelRatio**, scale canvas for that?
- SVG drawCallbacks 
- [Dark mode for SVG favicon swith `prefers-color-scheme`](https://blog.tomayac.com/2019/09/21/prefers-color-scheme-in-svg-favicons-for-dark-mode-icons/)
