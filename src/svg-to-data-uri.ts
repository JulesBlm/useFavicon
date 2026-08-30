import type { ReactElement } from "react";

/**
 * Renders a React element to an SVG data: URI, ready to use as a favicon
 * href — with `setFaviconHref`, or declaratively via React 19's
 * `<link rel="icon" href={uri} />`.
 *
 * Accepts any element whose rendered root is an `<svg>`, so icon-library
 * components (lucide-react, react-icons, ...) work directly. The SVG
 * namespace is added during serialization, so JSX may omit `xmlns`.
 *
 * Client-only: rendering requires a DOM. react-dom is loaded on demand,
 * so consumers who never call this don't need it installed.
 */
export const svgToDataUri = async (
  element: ReactElement,
): Promise<string> => {
  if (typeof document === "undefined")
    throw Error("svgToDataUri requires a DOM and cannot run on the server");

  const [{ createRoot }, { flushSync }] = await Promise.all([
    import("react-dom/client"),
    import("react-dom"),
  ]);

  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    flushSync(() => root.render(element));
    const svgNode = container.firstElementChild;
    if (!svgNode || svgNode.localName !== "svg")
      throw Error("svgToDataUri: the element must render an <svg> root");

    const markup = new XMLSerializer().serializeToString(svgNode);
    return `data:image/svg+xml,${encodeURIComponent(markup)}`;
  } finally {
    root.unmount();
  }
};
