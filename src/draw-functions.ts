export interface DrawCircleOptions {
  fillColor: string;
  radius: number;
  x: number;
  y: number;
}

export const drawCircle = (
  context: CanvasRenderingContext2D,
  faviconSize: number,
  options: DrawCircleOptions
): void => {
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

export interface DrawSquareOptions {
  fillColor: string;
  length: number;
  x: number;
  y: number;
}

export const drawSquare = (
  context: CanvasRenderingContext2D,
  faviconSize: number,
  options: DrawSquareOptions
): void => {
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
    length, 
    length 
  );
  context.fill();
};

export interface DrawTextBubbleOptions {
  label: string;
  color: string;
  fontSize: number;
  font: string;
}

// Constants for bubble positioning and sizing
const BUBBLE_BASE_WIDTH_RATIO = 1 / 3; // 33% of favicon size
const BUBBLE_HEIGHT_RATIO = 2 / 3; // 66% of favicon size (1/1.5)
const BUBBLE_CORNER_RADIUS_RATIO = 1 / 8; // 12.5% of favicon size
const BUBBLE_EXTRA_WIDTH_PER_CHAR = 1 / 5; // 20% of favicon size per character
const BUBBLE_TEXT_OFFSET_X_RATIO = 1 / 4.75; // Horizontal text positioning
const BUBBLE_TEXT_EXTRA_WIDTH_OFFSET = 1 / 4; // Extra offset for multi-char labels
const BUBBLE_TEXT_OFFSET_Y_RATIO = 1 / 8; // Vertical text positioning from bottom

// adapted from https://github.com/tommoor/tinycon/blob/master/tinycon.js#L167
export const drawTextBubble = (
  context: CanvasRenderingContext2D,
  faviconSize: number,
  options: Partial<DrawTextBubbleOptions>
): void => {
  const {
    label = "",
    color = "orangered",
    fontSize = faviconSize / 2,
    font = "sans-serif",
  } = options;

  // Calculate bubble dimensions
  // Bubble needs to be wider for multiple digits (supports up to 4 digits)
  const extraWidth = label.length * faviconSize * BUBBLE_EXTRA_WIDTH_PER_CHAR;
  const bubbleWidth = faviconSize * BUBBLE_BASE_WIDTH_RATIO + extraWidth;
  const bubbleHeight = faviconSize * BUBBLE_HEIGHT_RATIO;

  // Calculate bubble position (bottom-right corner)
  const top = faviconSize - bubbleHeight;
  const left = faviconSize - bubbleWidth;
  const bottom = faviconSize;
  const right = faviconSize;
  const radius = faviconSize * BUBBLE_CORNER_RADIUS_RATIO;

  // Calculate text position
  const baseTextX = faviconSize - bubbleWidth * BUBBLE_TEXT_OFFSET_X_RATIO;
  const textX = label.length > 1
    ? baseTextX + extraWidth * BUBBLE_TEXT_EXTRA_WIDTH_OFFSET
    : baseTextX;
  const textY = faviconSize - bubbleHeight * BUBBLE_TEXT_OFFSET_Y_RATIO;

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

