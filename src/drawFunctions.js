const drawCircle = (context, faviconSize, options) => {
  const {
    fillColor = "red",
    radius = faviconSize / 5,
    x = faviconSize - faviconSize / 5,
    y = faviconSize - faviconSize / 5,
  } = options;

  context.beginPath();
  context.arc(
    x,
    y,
    radius,
    0, // startAngle
    2 * Math.PI // endAngle
  );
  context.fillStyle = fillColor;
  context.fill();
};

const drawRect = (context, faviconSize, options) => {
  const {
    fillColor = "black",
    length = faviconSize / 5,
    x = faviconSize - faviconSize / 5,
    y = faviconSize - faviconSize / 5,
  } = options;

  context.beginPath();
  context.fillStyle = fillColor;
  context.fillRect(
    x,
    y,
    length, // width
    length // height
  );
  context.fill();
};

// adapted from https://github.com/tommoor/tinycon/blob/master/tinycon.js#L167
const drawBubble = (context, faviconSize, options) => {
  const {
    label = "",
    color = "orangered",
    fontSize = faviconSize / 2,
    font = "sans-serif",
  } = options;

  // these numbers are pure trial and error I should have thought about them more it works ok though
  // bubble needs to be wider for double digits, 4 digits max now
  const extraWidth = (label.length * faviconSize) / 5;

  const bubbleWidth = faviconSize / 3 + extraWidth;
  const bubbleHeight = faviconSize / 1.5; // 2/3

  const top = faviconSize - bubbleHeight,
    left = faviconSize - bubbleWidth,
    bottom = faviconSize,
    right = faviconSize,
    radius = faviconSize / 8,
    textX =
      label.length > 1
        ? faviconSize - bubbleWidth / 4.75 + extraWidth / 4
        : faviconSize - bubbleWidth / 4.75,
    textY = faviconSize - bubbleHeight / 8;

  console.log({ bubbleWidth }, bubbleWidth / 5);

  context.fillStyle = color;
  context.lineWidth = 12;

  // bubble
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
  context.fill();

  // bottom shadow
  context.beginPath();
  context.strokeStyle = "rgba(0,0,0,0.3)";
  context.moveTo(left + radius / 2.0, bottom);
  context.lineTo(right - radius / 2.0, bottom);
  context.stroke();

  // label
  context.fillStyle = "white";
  context.textAlign = "right";
  context.textBaseline = "bottom";
  context.lineWidth = faviconSize / 16;

  context.fillStyle = "white";
  context.font = `${fontSize}px ${font}`;

  context.fillText(label, textX, textY);
};

export { drawCircle, drawBubble, drawRect };
