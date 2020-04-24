import {ScreenPainter} from "./screen-painter";

export class CanvasPainter implements ScreenPainter {

    constructor(private canvasCtx: OffscreenCanvasRenderingContext2D,
                private canvasWidth: number,
                private canvasHeight: number) {
    }

    resize(canvasWidth: number,
           canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
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
