import { expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import useFavicon, { emojiSvg } from "./use-favicon";

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

test("emojiSvg returns a data-uri-safe SVG string", () => {
  const result = emojiSvg("🔥");

  expect(result).toContain("🔥");
  expect(result).toContain("xmlns");
  expect(result.startsWith("<svg")).toBe(true);
});
