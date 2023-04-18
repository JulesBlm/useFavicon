import * as React from "react";
export type DrawCallback = (context: CanvasRenderingContext2D, faviconSize: number, options: Record<PropertyKey, unknown>) => void;
declare function useFavicon(): readonly [string, {
    jsxToFavicon: (SvgEl: React.ReactSVGElement) => void;
    restoreFavicon: () => void;
    drawOnFavicon: (drawCallback: DrawCallback, { faviconSize, clear, ...options }?: {
        faviconSize?: number | undefined;
        clear?: boolean | undefined;
    }) => void;
    setFaviconHref: React.Dispatch<React.SetStateAction<string>>;
    setEmojiFavicon: (emoji: string) => void;
}];
export { useFavicon };
export default useFavicon;
