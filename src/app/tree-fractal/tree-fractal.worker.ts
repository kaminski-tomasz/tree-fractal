import {TreeModel} from "./tree-model";
import {TreeFractal} from "./tree-fractal";
import {CanvasPainter} from "../screen/canvas-painter";

class TreeFractalWorker {
    private readonly ctx: Worker = self as any;
    private canvasPainter: CanvasPainter;
    private treeFractal: TreeFractal;
    private canvas: OffscreenCanvas;

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
        this.getCanvas(event);
        this.createCanvasPainter();
        this.createTreeFractal();
        this.drawTreeFractal(event);
    }

    private getCanvas(event: MessageEvent) {
        this.canvas = event.data.canvas;
        if (event.data.width && event.data.height) {
            this.resizeCanvas(event.data.width, event.data.height);
        }
    }

    private resizeCanvas(width: number, height: number): void {
        if (this.canvas.width !== width ||
            this.canvas.height!== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }

    private drawTreeFractal(event: MessageEvent): void {
        const tree: TreeModel = event.data.tree;
        if (this.treeFractal) {
            const [width, height] = [event.data.width, event.data.height];
            if (width && height) {
                this.resizeCanvas(width, height);
                this.treeFractal.resize(width, height);
                this.canvasPainter.resize(width, height);
            }
            requestAnimationFrame(() => this.treeFractal.draw(tree));
        }
    }

    private createTreeFractal(): void {
        this.treeFractal = new TreeFractal(
            this.canvasPainter,
            this.canvas.width,
            this.canvas.height,
            () => this.notifyDrawingFinished()
        );
    }

    private createCanvasPainter(): void {
        this.canvasPainter = new CanvasPainter(
            this.canvas.getContext('2d'),
            this.canvas.width,
            this.canvas.height
        );
    }

    private notifyDrawingFinished(): void {
        this.ctx.postMessage( {msg: 'finished'} );
    }
}

new TreeFractalWorker();
