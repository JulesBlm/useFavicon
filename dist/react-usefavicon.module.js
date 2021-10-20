import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded = ["faviconSize", "clear"];

var createCanvas = function createCanvas(faviconSize) {
  var canvas = document.createElement("canvas");
  canvas.width = faviconSize;
  canvas.height = faviconSize;
  return canvas;
};

var svgFaviconTemplate = function svgFaviconTemplate(emoji) {
  return ("<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>\n      <text y=%22.9em%22 font-size=%2290%22>\n        " + emoji + "\n      </text>\n    </svg>\n  ").trim();
};

function useFavicon() {
  var _React$useState = React.useState(null),
      faviconHref = _React$useState[0],
      setFaviconHref = _React$useState[1];

  var faviconTagRef = React.useRef(null);

  var _React$useState2 = React.useState(null),
      originalHref = _React$useState2[0],
      setOriginalHref = _React$useState2[1]; // Grab initial favicon on mount


  React.useEffect(function () {
    // how do i know this is the right link element for sure though?
    var linkEl = document.querySelector("link[rel~='icon']") || document.head.appendChild(document.createElement("link"));
    faviconTagRef.current = linkEl;
    setFaviconHref(faviconTagRef.current.href);
    setOriginalHref(faviconTagRef.current.href);
  }, []);
  React.useEffect(function () {
    faviconTagRef.current.setAttribute("href", faviconHref);
  }, [faviconHref]);
  var restoreFavicon = React.useCallback(function () {
    setFaviconHref(originalHref);
  }, [originalHref]);
  var jsxToFavicon = React.useCallback(function (SvgEl) {
    if (SvgEl.type !== "svg") throw Error("React element for 'jsxToFavicon' must of type 'svg'");
    var renderedToString = renderToStaticMarkup(SvgEl);
    var encoded = encodeURIComponent(renderedToString);
    var replacedHashes = encoded.replace(/#/g, "%23");
    setFaviconHref("data:image/svg+xml," + replacedHashes);
  }, []);
  var setEmojiFavicon = React.useCallback(function (emoji) {
    setFaviconHref("data:image/svg+xml," + svgFaviconTemplate(emoji));
  }, []);
  var drawOnFavicon = React.useCallback(function (drawCallback, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$faviconSize = _ref.faviconSize,
        faviconSize = _ref$faviconSize === void 0 ? 256 : _ref$faviconSize,
        _ref$clear = _ref.clear,
        clear = _ref$clear === void 0 ? false : _ref$clear,
        props = _objectWithoutPropertiesLoose(_ref, _excluded);

    var canvas = createCanvas(faviconSize);
    var img = document.createElement("img");
    img.setAttribute("src", faviconHref); // The load event fires when a given resource has loaded, so when the <img> src attribute has changed

    img.onload = function () {
      var context = canvas.getContext("2d");

      if (!context) {
        console.warn("Could not create drawing context for favicon");
        return;
      }

      if (!clear) context.drawImage(img, 0, 0, faviconSize, faviconSize); // Draw current favicon as background

      drawCallback(context, faviconSize, props);
      var pngURI = canvas.toDataURL("image/png");
      setFaviconHref(pngURI);
    };
  }, [faviconHref]);
  var handlers = React.useMemo(function () {
    return {
      jsxToFavicon: jsxToFavicon,
      restoreFavicon: restoreFavicon,
      drawOnFavicon: drawOnFavicon,
      setFaviconHref: setFaviconHref,
      setEmojiFavicon: setEmojiFavicon
    };
  }, [jsxToFavicon, restoreFavicon, drawOnFavicon, setFaviconHref, setEmojiFavicon]);
  return [faviconHref, handlers];
}

var drawCircle = function drawCircle(context, faviconSize, options) {
  var _options$fillColor = options.fillColor,
      fillColor = _options$fillColor === void 0 ? "red" : _options$fillColor,
      _options$radius = options.radius,
      radius = _options$radius === void 0 ? faviconSize / 5 : _options$radius,
      _options$x = options.x,
      x = _options$x === void 0 ? faviconSize - faviconSize / 5 : _options$x,
      _options$y = options.y,
      y = _options$y === void 0 ? faviconSize - faviconSize / 5 : _options$y;
  context.beginPath();
  context.arc(x, y, radius, 0, // startAngle
  2 * Math.PI // endAngle
  );
  context.fillStyle = fillColor;
  context.fill();
};
var drawSquare = function drawSquare(context, faviconSize, options) {
  var _options$fillColor2 = options.fillColor,
      fillColor = _options$fillColor2 === void 0 ? "black" : _options$fillColor2,
      _options$length = options.length,
      length = _options$length === void 0 ? faviconSize / 5 : _options$length,
      _options$x2 = options.x,
      x = _options$x2 === void 0 ? faviconSize - faviconSize / 5 : _options$x2,
      _options$y2 = options.y,
      y = _options$y2 === void 0 ? faviconSize - faviconSize / 5 : _options$y2;
  context.beginPath();
  context.fillStyle = fillColor;
  context.fillRect(x, y, length, length);
  context.fill();
}; // adapted from https://github.com/tommoor/tinycon/blob/master/tinycon.js#L167

var drawTextBubble = function drawTextBubble(context, faviconSize, options) {
  var _options$label = options.label,
      label = _options$label === void 0 ? "" : _options$label,
      _options$color = options.color,
      color = _options$color === void 0 ? "orangered" : _options$color,
      _options$fontSize = options.fontSize,
      fontSize = _options$fontSize === void 0 ? faviconSize / 2 : _options$fontSize,
      _options$font = options.font,
      font = _options$font === void 0 ? "sans-serif" : _options$font; // these numbers are pure trial and error I should have thought about them more it works ok though
  // bubble needs to be wider for double digits, 4 digits max now

  var extraWidth = label.length * faviconSize / 5;
  var bubbleWidth = faviconSize / 3 + extraWidth;
  var bubbleHeight = faviconSize / 1.5; // 2/3

  var top = faviconSize - bubbleHeight,
      left = faviconSize - bubbleWidth,
      bottom = faviconSize,
      right = faviconSize,
      radius = faviconSize / 8,
      textX = label.length > 1 ? faviconSize - bubbleWidth / 4.75 + extraWidth / 4 : faviconSize - bubbleWidth / 4.75,
      textY = faviconSize - bubbleHeight / 8;
  context.fillStyle = color;
  context.lineWidth = 12; // bubble

  context.beginPath();
  context.moveTo(left + radius, top); //start

  context.quadraticCurveTo(left, top, left, top + radius);
  context.lineTo(left, bottom - radius);
  context.quadraticCurveTo(left, bottom, left + radius, bottom);
  context.lineTo(right - radius, bottom);
  context.quadraticCurveTo(right, bottom, right, bottom - radius);
  context.lineTo(right, top + radius);
  context.quadraticCurveTo(right, top, right - radius, top);
  context.closePath();
  context.fill(); // bottom shadow

  context.beginPath();
  context.strokeStyle = "rgba(0,0,0,0.3)";
  context.moveTo(left + radius / 2.0, bottom);
  context.lineTo(right - radius / 2.0, bottom);
  context.stroke(); // label

  context.fillStyle = "white";
  context.textAlign = "right";
  context.textBaseline = "bottom";
  context.lineWidth = faviconSize / 16;
  context.fillStyle = "white";
  context.font = fontSize + "px " + font;
  context.fillText(label, textX, textY);
};

export { drawCircle, drawSquare, drawTextBubble, useFavicon };
//# sourceMappingURL=react-usefavicon.module.js.map
