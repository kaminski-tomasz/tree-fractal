import {ScreenPainter} from "./screen-painter";

export class CanvasPainter implements ScreenPainter {

    constructor(private canvasCtx: CanvasRenderingContext2D,
                private canvasWidth: number,
                private canvasHeight: number) {
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string = "#FFFFFF"): void {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x1, y1);
        this.canvasCtx.lineTo(x2, y2);
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
    }

    setLineWidth(width: number): void {
        this.canvasCtx.lineWidth = width;
    }

    clearScreen(color: string): void {
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}
