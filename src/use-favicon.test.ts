import { renderHook, act } from "@testing-library/react-hooks";
import useFavicon from "./use-favicon";

test("should contain state and five setter functions", () => {
  const { result } = renderHook(() => useFavicon());

  expect(result.current[0]).toEqual("");
  expect(result.current[1]).toEqual(
    expect.objectContaining({
      jsxToFavicon: expect.any(Function),
      restoreFavicon: expect.any(Function),
      drawOnFavicon: expect.any(Function),
      setFaviconHref: expect.any(Function),
      setEmojiFavicon: expect.any(Function),
    })
  );
});

test("should update 'faviconHref' state when set with 'setFaviconHref'", () => {
  const { result } = renderHook(() => useFavicon());

  const testHref = "test-string.png";
  const [, { setFaviconHref }] = result.current;

  act(() => {
    setFaviconHref(testHref);
  });

  expect(result.current[0]).toEqual(testHref);
});

test("should update 'faviconHref' state to SVG emoji when set with 'setEmojiFavicon'", () => {
  const { result } = renderHook(() => useFavicon());

  const emoji = "💯";
  const [, { setEmojiFavicon }] = result.current;

  act(() => {
    setEmojiFavicon(emoji);
  });

  expect(result.current[0])
    .toEqual(`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
<text y=%22.9em%22 font-size=%2290%22>
💯
</text>
</svg>`);
});

test("should restore 'faviconHref' state after set with 'setFaviconHref' and restored with 'restoreFavicon'", () => {
  const { result } = renderHook(() => useFavicon());

  const testHref = "test-string.png";
  const [, { setFaviconHref, restoreFavicon }] = result.current;

  act(() => {
    setFaviconHref(testHref);
  });

  expect(result.current[0]).toEqual(testHref);

  act(() => {
    restoreFavicon();
  });

  expect(result.current[0]).toEqual("");
});
