export interface ScreenPainter {

    clearScreen(color: string): void;

    setLineWidth(width: number): void;

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string): void;
}
