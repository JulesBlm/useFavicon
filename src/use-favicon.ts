import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const createCanvas = (faviconSize: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;

  return canvas;
};

const svgFaviconTemplate = (emoji: string) =>
  `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
<text y=%22.9em%22 font-size=%2290%22>
${emoji}
</text>
</svg>`.trim();

function useFavicon() {
  const [faviconHref, setFaviconHref] = React.useState<string>(null!);
  const faviconTagRef = React.useRef<HTMLLinkElement>(null!);
  const [originalHref, setOriginalHref] = React.useState<string>(null!);

  // Grab initial favicon on mount
  React.useEffect(() => {
    // how do i know this is the right link element for sure though?
    const linkEl: HTMLLinkElement =
      document.querySelector("link[rel~='icon']") ||
      document.head.appendChild(document.createElement("link"));

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

  const jsxToFavicon = React.useCallback((SvgEl: React.ReactSVGElement) => {
    if (SvgEl.type !== "svg")
      throw Error("React element for 'jsxToFavicon' must of type 'svg'");

    const renderedToString = renderToStaticMarkup(SvgEl);
    const encoded = encodeURIComponent(renderedToString);
    const replacedHashes = encoded.replace(/#/g, "%23");

    setFaviconHref(`data:image/svg+xml,${replacedHashes}`);
  }, []);

  const setEmojiFavicon = React.useCallback((emoji) => {
    setFaviconHref(`data:image/svg+xml,${svgFaviconTemplate(emoji)}`);
  }, []);

  const drawOnFavicon = React.useCallback(
    (drawCallback, { faviconSize = 256, clear = false, ...props } = {}) => {
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

        drawCallback(context, faviconSize, props);

        const pngURI = canvas.toDataURL("image/png");
        setFaviconHref(pngURI);
      };
    },
    [faviconHref]
  );

  const handlers = React.useMemo(
    () => ({
      jsxToFavicon,
      restoreFavicon,
      drawOnFavicon,
      setFaviconHref,
      setEmojiFavicon,
    }),
    [
      jsxToFavicon,
      restoreFavicon,
      drawOnFavicon,
      setFaviconHref,
      setEmojiFavicon,
    ]
  );

  return [faviconHref, handlers];
}

export { useFavicon };
export default useFavicon;
