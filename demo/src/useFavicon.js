// need to configure parcel to not import the parent folder package.json
// that causes a double react, which breaks everything
// therefore this file is copied to this folder
import { useEffect, useState, useRef } from "react";

function useFavicon() {
  const [faviconHref, setFaviconHref] = useState(null);
  const refOfFaviconTag = useRef(null); // the name faviconRef would be too similar to faviconHref
  const [originalHref, setOriginalHref] = useState(null);

  // Grab initial favicon on mount
  useEffect(() => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");

    refOfFaviconTag.current = link;
    setFaviconHref(refOfFaviconTag.current.href);
    setOriginalHref(refOfFaviconTag.current.href);
  }, []);

  useEffect(() => {
    refOfFaviconTag.current.setAttribute("href", faviconHref);
    // refOfFaviconTag.current.href = faviconHref; // not sure which is better
  }, [faviconHref]);

  const restoreFavicon = () => setFaviconHref(originalHref);

  const faviconTemplate = (emoji) =>
    `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
        <text y=%22.9em%22 font-size=%2290%22>
          ${emoji}
        </text>
      </svg>
    `.trim();

  const setEmojiFavicon = (emoji) =>
    setFaviconHref(`data:image/svg+xml,${faviconTemplate(emoji)}`);

  const getCanvas = (faviconSize) => {
    const canvas = document.createElement("canvas");
    canvas.width = faviconSize;
    canvas.height = faviconSize;

    return canvas;
  };

  function drawOnFavicon(
    drawCallback,
    { faviconSize = 256, clear = false, ...props } = {}
  ) {
    const dpr = window.devicePixelRatio || 1;

    const scaledFaviconSize = faviconSize * dpr;

    const canvas = getCanvas(scaledFaviconSize);

    const img = document.createElement("img");
    img.src = faviconHref; // TODO: add option/param to use originalHref

    // The load event fires when a given resource has loaded so when the img src has changed
    img.onload = () => {
      const context = canvas.getContext("2d");

      if (!clear) context.drawImage(img, 0, 0, scaledFaviconSize, scaledFaviconSize); // Draw current favicon as background

      drawCallback(context, scaledFaviconSize, props);

      const pngURI = canvas.toDataURL("image/png");
      setFaviconHref(pngURI);
    };
  }

  return {
    faviconHref,
    restoreFavicon,
    drawOnFavicon,
    setFaviconHref,
    setEmojiFavicon,
  };
}

export { useFavicon };
export default useFavicon;