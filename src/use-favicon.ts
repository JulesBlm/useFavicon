import { useCallback, useEffect } from "react";
import type { ReactSVGElement } from "react";

const createCanvas = (faviconSize: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;

  return canvas;
};

export type DrawCallback<T extends object = Record<string, unknown>> = (
  context: CanvasRenderingContext2D,
  faviconSize: number,
  options: T,
) => void;

export interface DrawOptions {
  faviconSize?: number;
  clear?: boolean;
  [key: string]: unknown;
}

export interface UseFaviconHandlers {
  svgToFavicon: (SvgEl: ReactSVGElement) => Promise<void>;
  restoreFavicon: () => void;
  drawOnFavicon: <T extends object = Record<string, unknown>>(
    drawCallback: DrawCallback<T>,
    options?: DrawOptions & T,
  ) => Promise<void>;
  setFaviconHref: (href: string) => void;
}

export type UseFaviconReturn = UseFaviconHandlers;

export const emojiSvg = (emoji: string) =>
  `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
<text y=%22.9em%22 font-size=%2290%22>
${emoji}
</text>
</svg>`.trim();

/**
 * Finds the favicon link the browser is actually displaying, or creates a
 * new one. When a page has several icon links, browsers don't use the first
 * in document order: SVG icons are preferred, and among equals the last
 * link wins. Mutating any other link would be invisible.
 */
const findOrCreateFaviconLink = (): HTMLLinkElement => {
  // rel~='icon' matches the "icon" rel token, covering rel="icon" and
  // rel="shortcut icon" while excluding apple-touch-icon and mask-icon
  // (whose rels are single tokens that merely contain "icon")
  const candidates = document.querySelectorAll<HTMLLinkElement>(
    "link[rel~='icon']",
  );

  let chosen: HTMLLinkElement | null = null;
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const chosenIsSvg = chosen?.type === "image/svg+xml";
    if (candidate.type === "image/svg+xml" || !chosenIsSvg) {
      chosen = candidate;
    }
  }
  if (chosen) return chosen;

  // No suitable favicon found, create a new one
  const newLink = document.createElement("link");
  newLink.rel = "icon";
  document.head.appendChild(newLink);

  return newLink;
};

// Shared across all hook instances: there is only one favicon per document,
// so keeping this state per-instance lets a second instance capture an
// already-modified favicon as its "original" and restore the wrong thing.
let faviconLink: HTMLLinkElement | null = null;
let originalHref = "";

const getFaviconLink = (): HTMLLinkElement => {
  // Re-find the link if the framework replaced it (e.g. on a route change);
  // the new link's href then becomes the new original.
  if (!faviconLink || !faviconLink.isConnected) {
    faviconLink = findOrCreateFaviconLink();
    originalHref = faviconLink.href || "";
  }

  return faviconLink;
};

function useFavicon(): UseFaviconReturn {
  useEffect(function grabInitialFavicon() {
    getFaviconLink();
  }, []);

  const setFaviconHref = useCallback((href: string) => {
    if (typeof document === "undefined") return;
    getFaviconLink().href = href;
  }, []);

  const restoreFavicon = useCallback(() => {
    if (typeof document === "undefined") return;
    // Ensure the original href is captured before reading it
    getFaviconLink().href = originalHref;
  }, []);

  const svgToFavicon = useCallback(
    async (SvgEl: ReactSVGElement) => {
      if (SvgEl.type !== "svg")
        throw Error("React element for 'svgToFavicon' must be of type 'svg'");

      // Dynamic import to avoid bundling react-dom/server unless this function is used
      const { renderToStaticMarkup } = await import("react-dom/server");
      const renderedToString = renderToStaticMarkup(SvgEl);
      const encoded = encodeURIComponent(renderedToString);
      const replacedHashes = encoded.replace(/#/g, "%23");

      setFaviconHref(`data:image/svg+xml,${replacedHashes}`);
    },
    [setFaviconHref],
  );

  const drawOnFavicon = useCallback(
    async <T extends object = Record<string, unknown>>(
      drawCallback: DrawCallback<T>,
      drawOptions?: DrawOptions & T,
    ): Promise<void> => {
      if (typeof document === "undefined") return;

      const {
        faviconSize = 256,
        clear = false,
        ...options
      } = drawOptions ?? ({} as DrawOptions & T);

      const link = getFaviconLink();
      const canvas = createCanvas(faviconSize);
      const context = canvas.getContext("2d");
      if (!context) return;

      if (!clear && link.href) {
        const img = document.createElement("img");
        // Without this, a favicon served from another origin taints the
        // canvas and toDataURL() throws a SecurityError
        img.crossOrigin = "anonymous";
        img.src = link.href;

        try {
          await img.decode();
          context.drawImage(img, 0, 0, faviconSize, faviconSize);
        } catch {
          // The favicon failed to load (missing, blocked, or served without
          // CORS headers); draw on a blank canvas instead of rejecting
        }
      }

      drawCallback(context, faviconSize, options as T);

      link.href = canvas.toDataURL("image/png");
    },
    [],
  );

  return { drawOnFavicon, restoreFavicon, setFaviconHref, svgToFavicon };
}

export { useFavicon };
export default useFavicon;
