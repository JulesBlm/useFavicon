import * as React from "react";
declare function useFavicon(): readonly [string, {
    jsxToFavicon: (SvgEl: React.ReactSVGElement) => void;
    restoreFavicon: () => void;
    drawOnFavicon: (drawCallback: any, { faviconSize, clear, ...props }?: any) => void;
    setFaviconHref: React.Dispatch<React.SetStateAction<string>>;
    setEmojiFavicon: (emoji: any) => void;
}];
export { useFavicon };
export default useFavicon;
