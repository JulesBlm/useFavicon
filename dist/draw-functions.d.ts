interface DrawCircleOptions {
    fillColor: string;
    radius: number;
    x: number;
    y: number;
}
export declare const drawCircle: (context: CanvasRenderingContext2D, faviconSize: number, options: DrawCircleOptions) => void;
interface DrawSquareOptions {
    fillColor: string;
    length: number;
    x: number;
    y: number;
}
export declare const drawSquare: (context: CanvasRenderingContext2D, faviconSize: number, options: DrawSquareOptions) => void;
interface DrawTextBubbleOptions {
    label: string;
    color: string;
    fontSize: number;
    font: string;
}
export declare const drawTextBubble: (context: CanvasRenderingContext2D, faviconSize: number, options: Partial<DrawTextBubbleOptions>) => void;
export {};
