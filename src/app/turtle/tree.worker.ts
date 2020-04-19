import {Tree} from "./tree";
import {Painter, TurtleModel} from "./turtle.model";

class CanvasPainter implements Painter {
    constructor(private canvas: CanvasRenderingContext2D) {
    }

    lineTo(x1: number, y1: number, x2: number, y2: number, color: string = "#FFFFFF"): void {
        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        this.canvas.strokeStyle = color;
        this.canvas.stroke();
        this.canvas.closePath();
    }
}

class TreeFractalWorker {
    private turtle: TurtleModel;
    private readonly painter: CanvasPainter;

    constructor(private canvas: CanvasRenderingContext2D,
                private canvasWidth: number,
                private canvasHeight: number) {
        this.painter = new CanvasPainter(this.canvas);
        this.turtle = new TurtleModel(
            this.painter, [
                canvasWidth / 2,
                canvasHeight / 2 + 100
            ]);
    }

    drawTree(tree: Tree, size: number, level: number): void {
        if (level == 0) {
            return;
        }
        const color = this.getColor(level, tree.depth);
        this.turtle.move(size);
        [
            // Try these three branches
            // [50, 0.5],
            // [-55, 0.4],
            // [7, 0.80]
            [tree.angle1, tree.grow1],
            [tree.angle2, tree.grow2]
        ].forEach(([angle, grow]) => {
            this.turtle.turn(angle);
            this.drawTree(tree, grow * size, level - 1);
            this.turtle.turn(-angle);
        });

        this.canvas.lineWidth = 10 * level / tree.depth;
        this.turtle.setColor(color);
        this.turtle.show();
        this.turtle.move(-size);
        this.turtle.hide();
    }

    draw(tree: Tree) {
        // console.log(tree);
        this.clearCanvas();
        this.turtle.reset();
        this.turtle.hide();
        this.turtle.turn(-90);
        this.turtle.move(200);
        this.turtle.turn(180);
        this.drawTree(tree, 150, tree.depth);
    }

    getColor(level: number, maxDepth: number): string {
        const minFraction = 0.06;
        const opacity = minFraction + (1 - minFraction) * (level / maxDepth);
        return `rgba(255, 255, 255, ${opacity})`;
    }

    clearCanvas() {
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}

/*
 * Run Worker
 */
(() => {
    const ctx: Worker = self as any;
    let treeFractalWorker: TreeFractalWorker;

    ctx.addEventListener('message', (e: MessageEvent) => {
        switch (e.data.msg) {
            case 'init':
                treeFractalWorker = new TreeFractalWorker(
                    e.data.canvas.getContext('2d'),
                    e.data.canvas.width,
                    e.data.canvas.height
                );
                treeFractalWorker.draw(e.data.tree);
                break;
            case 'draw':
                if (!treeFractalWorker) {
                    return;
                }
                treeFractalWorker.draw(e.data.tree);
                break;
        }
    });
})();
