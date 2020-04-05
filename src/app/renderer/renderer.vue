<template lang="pug" src="./renderer.pug"/>
<style lang="less" src="./renderer.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 900;

    interface Data {
        canvas: CanvasRenderingContext2D,
        canvasWidth: number;
        canvasHeight: number;
        bend: number;
        sideLength: number;
        height: number;
        depth: number;
    }

    type Point = [number, number];

    export default Vue.extend({
        data(): Data {
            return {
                canvas: null,
                canvasWidth: CANVAS_WIDTH,
                canvasHeight: CANVAS_HEIGHT,
                bend: 0,
                sideLength: 900,
                height: 900 * Math.sqrt(3) / 2,
                depth: 5,
            }
        },
        mounted(): void {
            const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
            this.canvas = canvasElement.getContext("2d");
            this.drawSierpinskyTriangle();
        },
        methods: {
            drawShape(fillCallback: () => void, ...points: Point[]): void {
                this.canvas.beginPath();
                const first = points.shift();
                this.canvas.moveTo(first[0], first[1]);
                points.forEach(point => {
                    this.canvas.lineTo(point[0], point[1]);
                });
                fillCallback();
                this.canvas.closePath();
            },
            strokedShape(...points: Point[]): void {
                this.drawShape(() => {
                    this.canvas.stroke();
                }, ...points);
            },
            filledShape(...points: Point[]): void {
                this.drawShape(() => {
                    this.canvas.fill();
                }, ...points);
            },
            drawSierpinsky([x, y]: Point, w: number, h: number, b: number, depth: number) {
                if (depth == 0) {
                    return;
                }
                const hw = w / 2;
                const hh = h / 2;
                this.strokedShape(
                    [x, y], [(x + w), y],
                    [x + hw + b, y - h], [x, y],
                );
                this.filledShape(
                    [x + hw, y], [x + hw + hw / 2 + b / 2, y - hh],
                    [x + hw - hw / 2 + b / 2, y - hh],
                    [x + hw, y]
                );
                this.drawSierpinsky([x, y], hw, hh, b / 2, depth - 1);
                this.drawSierpinsky([x + hw, y], hw, hh, b / 2, depth - 1);
                this.drawSierpinsky([x + hw / 2 + b / 2, y - hh], hw, hh, b / 2, depth - 1);
            },
            drawSierpinskyTriangle(): void {
                this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                const w = Number(this.sideLength);
                const h = Number(this.height);
                const b = Number(this.bend);
                const d = Number(this.depth);
                const x = this.canvasWidth / 2 - w / 2;
                const y = this.canvasHeight / 2 + h / 2;
                this.drawSierpinsky([x, y], w, h, b, d);
            }
        }
    })
</script>
