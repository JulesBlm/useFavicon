import * as React from "react";
export type DrawCallback = (context: CanvasRenderingContext2D, faviconSize: number, options: Record<PropertyKey, unknown>) => void;
export interface DrawOptions {
    faviconSize?: number;
    clear?: boolean;
    [key: string]: unknown;
}
export interface UseFaviconHandlers {
    jsxToFavicon: (SvgEl: React.ReactSVGElement) => Promise<void>;
    restoreFavicon: () => void;
    drawOnFavicon: (drawCallback: DrawCallback, options?: DrawOptions) => void;
    setFaviconHref: React.Dispatch<React.SetStateAction<string>>;
    setEmojiFavicon: (emoji: string) => void;
}
export type UseFaviconReturn = readonly [string, UseFaviconHandlers];
declare function useFavicon(): UseFaviconReturn;
export { useFavicon };
export default useFavicon;
