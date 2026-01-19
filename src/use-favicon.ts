import * as React from "react";

const createCanvas = (faviconSize: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;

  return canvas;
};

export type DrawCallback = (context: CanvasRenderingContext2D, faviconSize: number, options: Record<PropertyKey, unknown>) => void

const svgFaviconTemplate = (emoji: string) =>
  `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
<text y=%22.9em%22 font-size=%2290%22>
${emoji}
</text>
</svg>`.trim();

/**
 * Finds the appropriate favicon link element or creates a new one.
 * Priority order: icon, shortcut icon, then creates a new one.
 * Ignores apple-touch-icon and other specialized favicons.
 */
const findOrCreateFaviconLink = (): HTMLLinkElement => {
  // Try to find standard favicon link tags in priority order
  const iconSelectors = [
    "link[rel='icon']",
    "link[rel='shortcut icon']",
    "link[rel~='icon']"  // Matches any rel containing 'icon'
  ];

  for (const selector of iconSelectors) {
    const existingLink = document.querySelector<HTMLLinkElement>(selector);
    if (existingLink && !existingLink.rel.includes('apple')) {
      return existingLink;
    }
  }

  // No suitable favicon found, create a new one
  const newLink = document.createElement("link");
  newLink.rel = "icon";
  newLink.type = "image/x-icon";
  document.head.appendChild(newLink);

  return newLink;
};

function useFavicon() {
  const [faviconHref, setFaviconHref] = React.useState<string>(null!);
  const faviconTagRef = React.useRef<HTMLLinkElement>(null!);
  const [originalHref, setOriginalHref] = React.useState<string>(null!);
  const pendingDrawRef = React.useRef<HTMLImageElement | null>(null);

  // Grab initial favicon on mount
  React.useEffect(() => {
    // SSR-safe: only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const linkEl = findOrCreateFaviconLink();
    faviconTagRef.current = linkEl;

    setFaviconHref(faviconTagRef.current.href);
    setOriginalHref(faviconTagRef.current.href);
  }, []);

  React.useEffect(() => {
    // SSR-safe: only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined' || !faviconTagRef.current) {
      return;
    }
    faviconTagRef.current.setAttribute("href", faviconHref);
  }, [faviconHref]);

  // Clean up any pending draw operations on unmount
  React.useEffect(() => {
    return () => {
      if (pendingDrawRef.current) {
        pendingDrawRef.current.onload = null;
        pendingDrawRef.current.onerror = null;
        pendingDrawRef.current = null;
      }
    };
  }, []);

  const restoreFavicon = React.useCallback(() => {
    setFaviconHref(originalHref);
  }, [originalHref]);

  const jsxToFavicon = React.useCallback(async (SvgEl: React.ReactSVGElement) => {
    if (SvgEl.type !== "svg")
      throw Error("React element for 'jsxToFavicon' must of type 'svg'");

    try {
      // Dynamic import to avoid bundling react-dom/server unless this function is used
      const { renderToStaticMarkup } = await import("react-dom/server");
      const renderedToString = renderToStaticMarkup(SvgEl);
      const encoded = encodeURIComponent(renderedToString);
      const replacedHashes = encoded.replace(/#/g, "%23");

      setFaviconHref(`data:image/svg+xml,${replacedHashes}`);
    } catch (error) {
      console.error("Failed to render JSX to favicon:", error);
      throw error;
    }
  }, []);

  const setEmojiFavicon = React.useCallback((emoji: string) => {
    setFaviconHref(`data:image/svg+xml,${svgFaviconTemplate(emoji)}`);
  }, []);

  const drawOnFavicon = React.useCallback(
    (
      drawCallback: DrawCallback,
      { faviconSize = 256, clear = false, ...options } = {}
    ) => {
      // SSR-safe: only run in browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.warn('drawOnFavicon is not available in server-side rendering environments');
        return;
      }

      // Cancel any pending draw operation to prevent race conditions
      if (pendingDrawRef.current) {
        pendingDrawRef.current.onload = null;
        pendingDrawRef.current.onerror = null;
        pendingDrawRef.current = null;
      }

      const canvas = createCanvas(faviconSize);

      const img = document.createElement("img");
      img.setAttribute("src", faviconHref);

      // Track this as the current pending operation
      pendingDrawRef.current = img;

      const cleanup = () => {
        // Only clean up if this is still the current pending operation
        if (pendingDrawRef.current === img) {
          pendingDrawRef.current = null;
        }
        img.onload = null;
        img.onerror = null;
      };

      // The load event fires when a given resource has loaded, so when the <img> src attribute has changed
      img.onload = () => {
        const context = canvas.getContext("2d");

        if (!context) {
          console.warn("Could not create drawing context for favicon");
          cleanup();
          return;
        }

        if (!clear) context.drawImage(img, 0, 0, faviconSize, faviconSize); // Draw current favicon as background

        drawCallback(context, faviconSize, options);

        const pngURI = canvas.toDataURL("image/png");
        setFaviconHref(pngURI);
        cleanup();
      };

      img.onerror = () => {
        console.warn("Failed to load favicon image for drawing");
        cleanup();
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

  return [faviconHref, handlers] as const;
}

export { useFavicon };
export default useFavicon;
