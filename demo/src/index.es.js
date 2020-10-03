import { useState, useRef, useEffect } from 'react';

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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function useFavicon() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      faviconHref = _useState2[0],
      setFaviconHref = _useState2[1];

  var refOfFaviconTag = useRef(null); // the name faviconRef would be too similar to faviconHref

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      originalHref = _useState4[0],
      setOriginalHref = _useState4[1]; // Grab initial favicon on mount


  useEffect(function () {
    // how do i know this is the right one though?
    var link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    refOfFaviconTag.current = link;
    setFaviconHref(refOfFaviconTag.current.href);
    setOriginalHref(refOfFaviconTag.current.href);
  }, []);
  useEffect(function () {
    refOfFaviconTag.current.setAttribute("href", faviconHref); // refOfFaviconTag.current.href = faviconHref; // not sure which is better
  }, [faviconHref]);

  var restoreFavicon = function restoreFavicon() {
    return setFaviconHref(originalHref);
  };

  var faviconTemplate = function faviconTemplate(emoji) {
    return "<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>\n        <text y=%22.9em%22 font-size=%2290%22>\n          ".concat(emoji, "\n        </text>\n      </svg>\n    ").trim();
  };

  var setEmojiFavicon = function setEmojiFavicon(emoji) {
    return setFaviconHref("data:image/svg+xml,".concat(faviconTemplate(emoji)));
  };

  var getCanvas = function getCanvas(faviconSize) {
    var canvas = document.createElement("canvas");
    canvas.width = faviconSize;
    canvas.height = faviconSize;
    return canvas;
  };

  function drawOnFavicon(drawCallback) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$faviconSize = _ref.faviconSize,
        faviconSize = _ref$faviconSize === void 0 ? 256 : _ref$faviconSize,
        _ref$clear = _ref.clear,
        clear = _ref$clear === void 0 ? false : _ref$clear,
        props = _objectWithoutProperties(_ref, ["faviconSize", "clear"]);

    var canvas = getCanvas(faviconSize);
    var img = document.createElement("img");
    img.src = faviconHref; // TODO: add option/param to use originalHref
    // The load event fires when a given resource has loaded so when the img src has changed

    img.onload = function () {
      var context = canvas.getContext("2d");
      if (!clear) context.drawImage(img, 0, 0, faviconSize, faviconSize); // Draw current favicon as background

      drawCallback(context, faviconSize, props);
      var pngURI = canvas.toDataURL("image/png");
      setFaviconHref(pngURI);
    };
  }

  return {
    faviconHref: faviconHref,
    restoreFavicon: restoreFavicon,
    drawOnFavicon: drawOnFavicon,
    setFaviconHref: setFaviconHref,
    setEmojiFavicon: setEmojiFavicon
  };
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

var drawRect = function drawRect(context, faviconSize, options) {
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
  context.fillRect(x, y, length, // width
  length // height
  );
  context.fill();
}; // adapted from https://github.com/tommoor/tinycon/blob/master/tinycon.js#L167


var drawBubble = function drawBubble(context, faviconSize, options) {
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
  context.font = "".concat(fontSize, "px ").concat(font);
  context.fillText(label, textX, textY);
};

export { drawBubble, drawCircle, drawRect, useFavicon };
