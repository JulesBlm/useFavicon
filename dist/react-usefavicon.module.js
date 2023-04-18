import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const createCanvas = faviconSize => {
  const canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;
  return canvas;
};
const svgFaviconTemplate = emoji => `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
<text y=%22.9em%22 font-size=%2290%22>
${emoji}
</text>
</svg>`.trim();
function useFavicon() {
  const [faviconHref, setFaviconHref] = React.useState(null);
  const faviconTagRef = React.useRef(null);
  const [originalHref, setOriginalHref] = React.useState(null);
  // Grab initial favicon on mount
  React.useEffect(() => {
    // how do i know this is the right link element for sure though?
    const linkEl = document.querySelector("link[rel~='icon']") || document.head.appendChild(document.createElement("link"));
    faviconTagRef.current = linkEl;
    setFaviconHref(faviconTagRef.current.href);
    setOriginalHref(faviconTagRef.current.href);
  }, []);
  React.useEffect(() => {
    faviconTagRef.current.setAttribute("href", faviconHref);
  }, [faviconHref]);
  const restoreFavicon = React.useCallback(() => {
    setFaviconHref(originalHref);
  }, [originalHref]);
  const jsxToFavicon = React.useCallback(SvgEl => {
    if (SvgEl.type !== "svg") throw Error("React element for 'jsxToFavicon' must of type 'svg'");
    const renderedToString = renderToStaticMarkup(SvgEl);
    const encoded = encodeURIComponent(renderedToString);
    const replacedHashes = encoded.replace(/#/g, "%23");
    setFaviconHref(`data:image/svg+xml,${replacedHashes}`);
  }, []);
  const setEmojiFavicon = React.useCallback(emoji => {
    setFaviconHref(`data:image/svg+xml,${svgFaviconTemplate(emoji)}`);
  }, []);
  const drawOnFavicon = React.useCallback((drawCallback, {
    faviconSize = 256,
    clear = false,
    ...options
  } = {}) => {
    const canvas = createCanvas(faviconSize);
    const img = document.createElement("img");
    img.setAttribute("src", faviconHref);
    // The load event fires when a given resource has loaded, so when the <img> src attribute has changed
    img.onload = () => {
      const context = canvas.getContext("2d");
      if (!context) {
        console.warn("Could not create drawing context for favicon");
        return;
      }
      if (!clear) context.drawImage(img, 0, 0, faviconSize, faviconSize); // Draw current favicon as background
      drawCallback(context, faviconSize, options);
      const pngURI = canvas.toDataURL("image/png");
      setFaviconHref(pngURI);
    };
  }, [faviconHref]);
  const handlers = React.useMemo(() => ({
    jsxToFavicon,
    restoreFavicon,
    drawOnFavicon,
    setFaviconHref,
    setEmojiFavicon
  }), [jsxToFavicon, restoreFavicon, drawOnFavicon, setFaviconHref, setEmojiFavicon]);
  return [faviconHref, handlers];
}

const drawCircle = (context, faviconSize, options) => {
  const {
    fillColor = "red",
    radius = faviconSize / 5,
    x = faviconSize - faviconSize / 5,
    y = faviconSize - faviconSize / 5
  } = options;
  context.beginPath();
  context.arc(x, y, radius, 0,
  // startAngle
  2 * Math.PI // endAngle
  );

  context.fillStyle = fillColor;
  context.fill();
};
const drawSquare = (context, faviconSize, options) => {
  const {
    fillColor = "black",
    length = faviconSize / 5,
    x = faviconSize - faviconSize / 5,
    y = faviconSize - faviconSize / 5
  } = options;
  context.beginPath();
  context.fillStyle = fillColor;
  context.fillRect(x, y, length, length);
  context.fill();
};
// adapted from https://github.com/tommoor/tinycon/blob/master/tinycon.js#L167
const drawTextBubble = (context, faviconSize, options) => {
  const {
    label = "",
    color = "orangered",
    fontSize = faviconSize / 2,
    font = "sans-serif"
  } = options;
  // these numbers are pure trial and error I should have thought about them more it works ok though
  // bubble needs to be wider for double digits, 4 digits max now
  const extraWidth = label.length * faviconSize / 5;
  const bubbleWidth = faviconSize / 3 + extraWidth;
  const bubbleHeight = faviconSize / 1.5; // 2/3
  const top = faviconSize - bubbleHeight,
    left = faviconSize - bubbleWidth,
    bottom = faviconSize,
    right = faviconSize,
    radius = faviconSize / 8,
    textX = label.length > 1 ? faviconSize - bubbleWidth / 4.75 + extraWidth / 4 : faviconSize - bubbleWidth / 4.75,
    textY = faviconSize - bubbleHeight / 8;
  context.fillStyle = color;
  context.lineWidth = 12;
  // bubble
  context.beginPath();
  context.moveTo(left + radius, top); //start
  context.quadraticCurveTo(left, top, left, top + radius);
  context.lineTo(left, bottom - radius);
  context.quadraticCurveTo(left, bottom, left + radius, bottom);
  context.lineTo(right - radius, bottom);
  context.quadraticCurveTo(right, bottom, right, bottom - radius);
  context.lineTo(right, top + radius);
  context.quadraticCurveTo(right, top, right - radius, top);
  context.closePath();
  context.fill();
  // bottom shadow
  context.beginPath();
  context.strokeStyle = "rgba(0,0,0,0.3)";
  context.moveTo(left + radius / 2.0, bottom);
  context.lineTo(right - radius / 2.0, bottom);
  context.stroke();
  // label
  context.fillStyle = "white";
  context.textAlign = "right";
  context.textBaseline = "bottom";
  context.lineWidth = faviconSize / 16;
  context.fillStyle = "white";
  context.font = `${fontSize}px ${font}`;
  context.fillText(label, textX, textY);
};

export { drawCircle, drawSquare, drawTextBubble, useFavicon };
//# sourceMappingURL=react-usefavicon.module.js.map
