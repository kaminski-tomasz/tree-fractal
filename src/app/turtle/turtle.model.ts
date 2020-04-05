
export type Point = [number, number];

export interface Painter {
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
}

export class TurtleModel {

    private drawing = true;
    private position: Point;
    private angle = 0;

    constructor(private painter: Painter,
                private start: Point) {
        this.position = start;
        this.reset();
    }

    public reset(): void {
        this.position = this.start;
        this.painter.moveTo(this.start[0], this.start[1])
        this.angle = 0;
    }

    public show(): void {
        this.drawing = true;
    }

    public hide(): void {
        this.drawing = false;
    }

    public turn(degrees: number) {
        const radians = degrees * Math.PI / 180;
        this.angle = this.angle - radians;
    }

    public move(distance: number) {
        const [nextX, nextY] = this.nextPosition(distance);
        if (this.drawing) {
            this.painter.lineTo(nextX, nextY);
        } else {
            this.painter.moveTo(nextX, nextY);
        }
        this.position = [nextX, nextY];
    }

    private nextPosition(distance: number): Point {
        const [x, y] = this.position;
        return [
            x + distance * Math.cos(this.angle),
            y + distance * Math.sin(this.angle),
        ];
    }
}
