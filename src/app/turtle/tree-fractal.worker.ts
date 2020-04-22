import {TreeModel} from "./tree-model";
import {TreeFractal} from "./tree-fractal";
import {CanvasPainter} from "./canvas-painter";

class TreeFractalWorker {
    private readonly ctx: Worker = self as any;
    private treeFractal: TreeFractal;
    private canvasCtx: CanvasRenderingContext2D;
    private canvasWidth: number;
    private canvasHeight: number;

    constructor() {
        this.ctx.addEventListener('message', (event: MessageEvent) => {
            switch (event.data.msg) {
                case 'init':
                    this.initTreeFractal(event);
                    break;
                case 'draw':
                    this.drawTreeFractal(event);
                    break;
            }
        });
    }

    private initTreeFractal(event: MessageEvent) {
        this.getCanvasContextFrom(event);
        this.createTreeFractal();
        this.drawTreeFractal(event);
    }

    private getCanvasContextFrom(event: MessageEvent) {
        this.canvasCtx = event.data.canvas.getContext('2d');
        this.canvasWidth = event.data.canvas.width;
        this.canvasHeight = event.data.canvas.height;
    }

    private drawTreeFractal(event: MessageEvent): void {
        const tree: TreeModel = event.data.tree;
        if (this.treeFractal) {
            requestAnimationFrame(() => this.treeFractal.draw(tree));
        }
    }

    private createTreeFractal(): void {
        this.treeFractal = new TreeFractal(
            this.createCanvasPainter(),
            this.canvasWidth,
            this.canvasHeight,
            () => this.notifyDrawingFinished()
        );
    }

    private createCanvasPainter(): CanvasPainter {
        return new CanvasPainter(
            this.canvasCtx,
            this.canvasWidth,
            this.canvasHeight
        );
    }

    private notifyDrawingFinished(): void {
        this.ctx.postMessage( {msg: 'finished'} );
    }
}

new TreeFractalWorker();
