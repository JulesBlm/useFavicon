import { beforeEach, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { useFavicon, emojiSvg } from "./use-favicon";
import { svgToDataUri } from "./svg-to-data-uri";

beforeEach(() => {
  // Disconnect any favicon link from previous tests so the hook's shared
  // module state re-discovers the favicon and re-captures the original href
  document.head
    .querySelectorAll("link")
    .forEach((link) => link.remove());
});

test("should return three handler functions", () => {
  const { result } = renderHook(() => useFavicon());

  expect(result.current).toEqual(
    expect.objectContaining({
      restoreFavicon: expect.any(Function),
      drawOnFavicon: expect.any(Function),
      setFaviconHref: expect.any(Function),
    }),
  );
});

test("setFaviconHref updates the favicon link and restoreFavicon reverts it", () => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "https://example.com/original.png";
  document.head.appendChild(link);

  const { result } = renderHook(() => useFavicon());

  act(() => {
    result.current.setFaviconHref("https://example.com/badge.png");
  });
  expect(link.href).toBe("https://example.com/badge.png");

  act(() => {
    result.current.restoreFavicon();
  });
  expect(link.href).toBe("https://example.com/original.png");
});

test("a second hook instance restores the original favicon, not an intermediate one", () => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "https://example.com/original.png";
  document.head.appendChild(link);

  const first = renderHook(() => useFavicon());
  act(() => {
    first.result.current.setFaviconHref("https://example.com/modified.png");
  });

  // Mounts after the favicon was already modified
  const second = renderHook(() => useFavicon());
  act(() => {
    second.result.current.restoreFavicon();
  });

  expect(link.href).toBe("https://example.com/original.png");
});

test("prefers the SVG icon link when both .ico and SVG links exist", () => {
  const icoLink = document.createElement("link");
  icoLink.rel = "icon";
  icoLink.href = "https://example.com/favicon.ico";
  document.head.appendChild(icoLink);

  const svgLink = document.createElement("link");
  svgLink.rel = "icon";
  svgLink.type = "image/svg+xml";
  svgLink.href = "https://example.com/favicon.svg";
  document.head.appendChild(svgLink);

  const { result } = renderHook(() => useFavicon());
  act(() => {
    result.current.setFaviconHref("https://example.com/badge.png");
  });

  expect(svgLink.href).toBe("https://example.com/badge.png");
  expect(icoLink.href).toBe("https://example.com/favicon.ico");
});

test("prefers an SVG icon link even when it comes before the .ico link", () => {
  const svgLink = document.createElement("link");
  svgLink.rel = "icon";
  svgLink.type = "image/svg+xml";
  svgLink.href = "https://example.com/favicon.svg";
  document.head.appendChild(svgLink);

  const icoLink = document.createElement("link");
  icoLink.rel = "icon";
  icoLink.href = "https://example.com/favicon.ico";
  document.head.appendChild(icoLink);

  const { result } = renderHook(() => useFavicon());
  act(() => {
    result.current.setFaviconHref("https://example.com/badge.png");
  });

  expect(svgLink.href).toBe("https://example.com/badge.png");
  expect(icoLink.href).toBe("https://example.com/favicon.ico");
});

test("uses the last icon link when none are SVG-typed", () => {
  const firstLink = document.createElement("link");
  firstLink.rel = "shortcut icon";
  firstLink.href = "https://example.com/legacy.ico";
  document.head.appendChild(firstLink);

  const lastLink = document.createElement("link");
  lastLink.rel = "icon";
  lastLink.href = "https://example.com/favicon.png";
  document.head.appendChild(lastLink);

  const { result } = renderHook(() => useFavicon());
  act(() => {
    result.current.setFaviconHref("https://example.com/badge.png");
  });

  expect(lastLink.href).toBe("https://example.com/badge.png");
  expect(firstLink.href).toBe("https://example.com/legacy.ico");
});

test("ignores apple-touch-icon links", () => {
  const appleLink = document.createElement("link");
  appleLink.rel = "apple-touch-icon";
  appleLink.href = "https://example.com/apple-touch-icon.png";
  document.head.appendChild(appleLink);

  const { result } = renderHook(() => useFavicon());
  act(() => {
    result.current.setFaviconHref("https://example.com/badge.png");
  });

  expect(appleLink.href).toBe("https://example.com/apple-touch-icon.png");
  const created = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  expect(created?.href).toBe("https://example.com/badge.png");
});

test("svgToDataUri serializes JSX SVG to a data URI with xmlns", async () => {
  let uri = "";
  await act(async () => {
    // No xmlns in the JSX: the serializer must add it for the data URI to work
    uri = await svgToDataUri(
      createElement(
        "svg",
        { viewBox: "0 0 100 100" },
        createElement("circle", { cx: 50, cy: 50, r: 50, fill: "tomato" }),
      ),
    );
  });

  expect(uri).toMatch(/^data:image\/svg\+xml,/);
  const markup = decodeURIComponent(uri.slice("data:image/svg+xml,".length));
  expect(markup).toContain('xmlns="http://www.w3.org/2000/svg"');
  expect(markup).toContain("<circle");
});

test("svgToDataUri accepts components that render an svg root", async () => {
  // Icon-library components (lucide-react, react-icons) have this shape
  const Icon = ({ color }: { color: string }) =>
    createElement(
      "svg",
      { viewBox: "0 0 24 24" },
      createElement("path", { d: "M4 4h16v16H4z", fill: color }),
    );

  let uri = "";
  await act(async () => {
    uri = await svgToDataUri(createElement(Icon, { color: "rebeccapurple" }));
  });

  const markup = decodeURIComponent(uri.slice("data:image/svg+xml,".length));
  expect(markup).toContain('fill="rebeccapurple"');
});

test("svgToDataUri rejects elements that don't render an svg root", async () => {
  await act(async () => {
    await expect(svgToDataUri(createElement("div"))).rejects.toThrow(
      "must render an <svg> root",
    );
  });
});

test("emojiSvg returns a data-uri-safe SVG string", () => {
  const result = emojiSvg("🔥");

  expect(result).toContain("🔥");
  expect(result).toContain("xmlns");
  expect(result.startsWith("<svg")).toBe(true);
});
