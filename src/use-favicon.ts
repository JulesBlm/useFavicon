import { useCallback, useEffect, useRef } from "react";
import type { ReactSVGElement } from "react";

const createCanvas = (faviconSize: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;

  return canvas;
};

export type DrawCallback<T extends Record<string, unknown> = Record<string, unknown>> = (
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
  drawOnFavicon: (drawCallback: DrawCallback, options?: DrawOptions) => Promise<void>;
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
 * Finds the appropriate favicon link element or creates a new one.
 * Priority order: icon, shortcut icon, then creates a new one.
 * Ignores apple-touch-icon and other specialized favicons.
 */
const findOrCreateFaviconLink = (): HTMLLinkElement => {
  // Try to find standard favicon link tags in priority order
  const iconSelectors = [
    "link[rel='icon']",
    "link[rel='shortcut icon']",
    "link[rel~='icon']", // Matches any rel containing 'icon'
  ];

  for (const selector of iconSelectors) {
    const existingLink = document.querySelector<HTMLLinkElement>(selector);
    if (existingLink && !existingLink.rel.includes("apple")) {
      return existingLink;
    }
  }

  // No suitable favicon found, create a new one
  const newLink = document.createElement("link");
  newLink.rel = "icon";
  document.head.appendChild(newLink);

  return newLink;
};

function useFavicon(): UseFaviconReturn {
  const faviconTagRef = useRef<HTMLLinkElement | null>(null);
  const originalHrefRef = useRef<string>("");
  const faviconHrefRef = useRef<string>("");

  const setHref = useCallback((href: string) => {
    faviconHrefRef.current = href;
    if (faviconTagRef.current) {
      faviconTagRef.current.href = href;
    }
  }, []);

  useEffect(function grabInitialFavicon() {
    const linkEl = findOrCreateFaviconLink();
    faviconTagRef.current = linkEl;

    const href = linkEl.href || "";
    faviconHrefRef.current = href;
    originalHrefRef.current = href;
  }, []);

  const setFaviconHref = setHref;

  const restoreFavicon = useCallback(
    () => setHref(originalHrefRef.current),
    [setHref],
  );

  const svgToFavicon = useCallback(
    async (SvgEl: ReactSVGElement) => {
      if (SvgEl.type !== "svg")
        throw Error("React element for 'svgToFavicon' must be of type 'svg'");

      // Dynamic import to avoid bundling react-dom/server unless this function is used
      const { renderToStaticMarkup } = await import("react-dom/server");
      const renderedToString = renderToStaticMarkup(SvgEl);
      const encoded = encodeURIComponent(renderedToString);
      const replacedHashes = encoded.replace(/#/g, "%23");

      setHref(`data:image/svg+xml,${replacedHashes}`);
    },
    [setHref],
  );

  const drawOnFavicon = useCallback(
    async (
      drawCallback: DrawCallback,
      { faviconSize = 256, clear = false, ...options }: DrawOptions = {},
    ): Promise<void> => {
      if (typeof document === "undefined") return;

      const canvas = createCanvas(faviconSize);
      const img = document.createElement("img");
      img.src = faviconHrefRef.current;

      await img.decode();

      const context = canvas.getContext("2d");
      if (!context) return;

      if (!clear) {
        context.drawImage(img, 0, 0, faviconSize, faviconSize);
      }
      drawCallback(context, faviconSize, options);

      setHref(canvas.toDataURL("image/png"));
    },
    [setHref],
  );

  return { drawOnFavicon, restoreFavicon, setFaviconHref, svgToFavicon };
}

export { useFavicon };
export default useFavicon;
