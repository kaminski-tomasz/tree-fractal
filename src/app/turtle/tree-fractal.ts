import {ScreenPainter, Turtle} from "./turtle";
import {TreeModel} from "./tree-model";

export class TreeFractal {
    private readonly vOffset = 100;
    private turtle: Turtle;
    private tree: TreeModel;

    constructor(private screenPainter: ScreenPainter,
                private screenWidth: number,
                private screenHeight: number,
                private drawFinished = () => {}) {
        this.turtle = new Turtle(
            this.screenPainter, [
                screenWidth / 2,
                screenHeight / 2 + this.vOffset
            ]);
    }

    draw(tree: TreeModel) {
        this.setModel(tree);
        this.resetScreen();
        this.drawTree(150, tree.depth);
        this.drawFinished();
    }

    private setModel(tree: TreeModel) {
        this.tree = tree;
    }

    private drawTree(length: number, level: number): void {
        if (level > 0) {
            this.turtle.move(length);
            this.drawBranches(length, level);
            this.setBranchWidth(level);
            this.setBranchColor(level);
            this.turtle.show();
            this.turtle.move(-length);
            this.turtle.hide();
        }
    }

    private setBranchWidth(level: number): void {
        const width = 10 * level / this.tree.depth;
        this.turtle.setLineWidth(width);
    }

    private setBranchColor(level: number): void {
        const minFraction = 0.06;
        const opacity = minFraction + (1 - minFraction) * (level / this.tree.depth);
        const branchColor = `rgba(255, 255, 255, ${opacity})`;
        this.turtle.setColor(branchColor);
    }

    private drawBranches(length: number, level: number): void {
        [
            [this.tree.angle1, this.tree.grow1],
            [this.tree.angle2, this.tree.grow2]
        ].forEach(([angle, grow]) => {
            this.turtle.turn(angle);
            this.drawTree(grow * length, level - 1);
            this.turtle.turn(-angle);
        });
    }

    private resetScreen(): void {
        this.turtle.clear();
        this.turtle.reset();
        this.turtle.hide();
        this.turtle.turn(-90);
        this.turtle.move(200);
        this.turtle.turn(180);
    }
}
