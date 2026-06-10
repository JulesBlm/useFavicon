import { beforeEach, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useFavicon, { emojiSvg } from "./use-favicon";

beforeEach(() => {
  // Disconnect any favicon link from previous tests so the hook's shared
  // module state re-discovers the favicon and re-captures the original href
  document.head
    .querySelectorAll("link")
    .forEach((link) => link.remove());
});

test("should return four handler functions", () => {
  const { result } = renderHook(() => useFavicon());

  expect(result.current).toEqual(
    expect.objectContaining({
      svgToFavicon: expect.any(Function),
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

test("emojiSvg returns a data-uri-safe SVG string", () => {
  const result = emojiSvg("🔥");

  expect(result).toContain("🔥");
  expect(result).toContain("xmlns");
  expect(result.startsWith("<svg")).toBe(true);
});
