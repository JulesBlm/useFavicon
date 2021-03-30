import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

function useFavicon() {
  const [faviconHref, setFaviconHref] = React.useState(null);
  const refOfFaviconTag = React.useRef(null); // the name faviconRef would be too similar to faviconHref
  const [originalHref, setOriginalHref] = React.useState(null);

  // Grab initial favicon on mount
  React.useEffect(() => {
    // how do i know this is the right one for sure though?
    // querySelectorAll("link[rel~='icon']")
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.head.appendChild(document.createElement("link"));

    refOfFaviconTag.current = link;
    setFaviconHref(refOfFaviconTag.current.href);
    setOriginalHref(refOfFaviconTag.current.href);
  }, []);

  React.useEffect(() => {
    refOfFaviconTag.current.setAttribute("href", faviconHref);
  }, [faviconHref]);

  const restoreFavicon = React.useCallback(() => setFaviconHref(originalHref), [
    originalHref,
  ]);

  const svgFaviconTemplate = React.useCallback(
    (emoji) =>
      `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
        <text y=%22.9em%22 font-size=%2290%22>
          ${emoji}
        </text>
      </svg>
    `.trim(),
    []
  );

  const jsxToFavicon = React.useCallback((SvgEl) => {
    if ((<SvgEl />).type().type !== "svg")
      throw Error("React component for jsxToFavicon must a <svg> element");

    const replacedQuotes = renderToStaticMarkup(<SvgEl />).replace(/"/g, "%22");
    const replacedHashes = replacedQuotes.replace(/#/g, "%23");
    setFaviconHref(`data:image/svg+xml,${replacedHashes}`);
  }, []);

  const setEmojiFavicon = React.useCallback(
    (emoji) =>
      setFaviconHref(`data:image/svg+xml,${svgFaviconTemplate(emoji)}`),
    [svgFaviconTemplate]
  );

  const createCanvas = React.useCallback((faviconSize) => {
    const canvas = document.createElement("canvas");
    canvas.width = faviconSize;
    canvas.height = faviconSize;

    return canvas;
  }, []);

  const drawOnFavicon = React.useCallback(
    (drawCallback, { faviconSize = 256, clear = false, ...props } = {}) => {
      const canvas = createCanvas(faviconSize);

      const img = document.createElement("img");
      img.src = faviconHref;

      // The load event fires when a given resource has loaded, so when the <img> src attribute has changed
      img.onload = () => {
        const context = canvas.getContext("2d");

        if (!clear) context.drawImage(img, 0, 0, faviconSize, faviconSize); // Draw current favicon as background

        drawCallback(context, faviconSize, props);

        const pngURI = canvas.toDataURL("image/png");
        setFaviconHref(pngURI);
      };
    },
    [createCanvas, faviconHref]
  );

  return {
    faviconHref,
    jsxToFavicon,
    restoreFavicon,
    drawOnFavicon,
    setFaviconHref,
    setEmojiFavicon,
  };
}

export { useFavicon };
export default useFavicon;
