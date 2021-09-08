import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

function useFavicon() {
  const [faviconHref, setFaviconHref] = React.useState<string>(null!);
  const faviconTagRef = React.useRef<HTMLLinkElement>(null!);
  const [originalHref, setOriginalHref] = React.useState<string>(null!);

  // Grab initial favicon on mount
  React.useEffect(() => {
    // how do i know this is the right one for sure though?
    const link: HTMLLinkElement =
      document.querySelector("link[rel~='icon']") ||
      document.head.appendChild(document.createElement("link"));

    faviconTagRef.current = link;

    setFaviconHref(faviconTagRef.current.href);
    setOriginalHref(faviconTagRef.current.href);
  }, []);

  React.useEffect(() => {
    // if (faviconTagRef.current)
    faviconTagRef.current!.setAttribute("href", faviconHref);
  }, [faviconHref]);

  const restoreFavicon = React.useCallback(
    () => setFaviconHref(originalHref),
    [originalHref]
  );

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

  const demoSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="256"
      height="256"
      viewBox="0 0 100 100"
    >
      <rect width="100" height="100" rx="20" fill="black" />
      <path
        fill="lavender"
        d="M36.63 22.42L66.52 22.42Q66.78 22.87 67.06 23.63Q67.32 24.40 67.32 25.30L67.32 25.30Q67.32 26.83 66.60 27.73Q65.88 28.63 64.53 28.63L64.53 28.63L40.05 28.63L40.05 47.35L63.36 47.35Q63.63 47.80 63.91 48.56Q64.17 49.33 64.17 50.23L64.17 50.23Q64.17 51.76 63.45 52.66Q62.73 53.56 61.38 53.56L61.38 53.56L40.05 53.56L40.05 77.05Q39.60 77.23 38.66 77.41Q37.71 77.59 36.72 77.59L36.72 77.59Q32.67 77.59 32.67 74.34L32.67 74.34L32.67 26.38Q32.67 24.58 33.75 23.50Q34.84 22.42 36.63 22.42L36.63 22.42Z"
      />
    </svg>
  );

  const jsxToFavicon = React.useCallback((SvgEl: React.ReactNode) => {
    const svgComp = <SvgEl />;

    // if (().type().type !== "svg")
    //     throw Error("React component for 'jsxToFavicon' must of type <svg>");

    // encodeURIComponent?
    const replacedQuotes = renderToStaticMarkup(svgComp).replace(/"/g, "%22");
    //   const replacedHashes = replacedQuotes.replace(/#/g, "%23"); // encodeURIComponent?
    //   setFaviconHref(`data:image/svg+xml,${replacedHashes}`);
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

        if (!clear && context)
          context.drawImage(img, 0, 0, faviconSize, faviconSize); // Draw current favicon as background

        drawCallback(context!, faviconSize, props);

        const pngURI = canvas.toDataURL("image/png");
        setFaviconHref(pngURI);
      };
    },
    [createCanvas, faviconHref]
  );

  return [
    faviconHref,
    {
      // jsxToFavicon,
      restoreFavicon,
      drawOnFavicon,
      setFaviconHref,
      setEmojiFavicon,
    },
  ];
}

export { useFavicon };
export default useFavicon;
