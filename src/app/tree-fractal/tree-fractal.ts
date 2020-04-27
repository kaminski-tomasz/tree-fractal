import {Turtle} from "../turtle/turtle";
import {TreeModel} from "./tree-model";
import {ScreenPainter} from "../screen/screen-painter";

export class TreeFractal {
    private turtle: Turtle;
    private tree: TreeModel;

    constructor(private screenPainter: ScreenPainter,
                private screenWidth: number,
                private screenHeight: number,
                private drawFinished = () => {}) {
        this.turtle = this.createTurtle();
    }

    resize(screenWidth: number, screenHeight: number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.turtle = this.createTurtle();
    }

    draw(tree: TreeModel) {
        this.setModel(tree);
        this.clearScreen();
        this.resetTurtle();
        this.drawTree(this.getInitialSize() * tree.root, tree.depth);
        this.drawFinished();
    }

    private createTurtle() {
        return new Turtle(
            this.screenPainter, [
                this.screenWidth / 3,
                this.screenHeight / 2 + this.getInitialSize()
            ]);
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
        const maxWidth = Math.min(10, this.getInitialSize() / 15);
        const width = maxWidth * level / this.tree.depth;
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

    private getInitialSize() {
        return this.screenHeight / 6;
    }

    private clearScreen(): void {
        this.turtle.clear();
    }

    private resetTurtle(): void {
        this.turtle.reset();
        this.turtle.hide();
        this.turtle.turn(-90);
        this.turtle.move(this.getInitialSize() * this.tree.root);
        this.turtle.turn(180);
    }
}
