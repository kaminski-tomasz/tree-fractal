
export type Point = [number, number];

export interface Painter {
    lineTo(x1: number, y1: number, x2: number, y2: number, color: string): void;
}

export class TurtleModel {

    private drawing = true;
    private position: Point;
    private color = "#FFFFFF";
    private angle = 0;

    constructor(private painter: Painter,
                private start: Point) {
        this.position = start;
        this.reset();
    }

    public reset(): void {
        this.position = this.start;
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
        const [x, y] = this.position;
        const [nextX, nextY] = this.nextPosition(distance);
        if (this.drawing) {
            this.painter.lineTo(x, y, nextX, nextY, this.color);
        }
        this.position = [nextX, nextY];
    }

    public setColor(color: string) {
        this.color = color;
    }

    private nextPosition(distance: number): Point {
        const [x, y] = this.position;
        return [
            x + distance * Math.cos(this.angle),
            y + distance * Math.sin(this.angle),
        ];
    }
}
