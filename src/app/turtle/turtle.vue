<template lang="pug" src="./turtle.pug"/>
<style lang="less" src="./turtle.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";
    import {Painter, Point, TurtleModel} from "./turtle.model";

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 900;

    class CanvasPainter implements Painter {

        constructor(private canvas: CanvasRenderingContext2D) {
        }

        lineTo(x: number, y: number): void {
            this.canvas.lineTo(x, y);
        }

        moveTo(x: number, y: number): void {
            this.canvas.moveTo(x, y);
        }
    }

    interface Tree {
        depth: number,
        angle1: number,
        angle2: number,
        grow1: number,
        grow2: number,
    }

    interface Data {
        canvas: CanvasRenderingContext2D,
        painter: CanvasPainter,
        turtle: TurtleModel,
        canvasWidth: number,
        canvasHeight: number,
        tree: Tree
    }

    export default Vue.extend({
        data(): Data {
            return {
                canvas: null,
                painter: null,
                turtle: null,
                canvasWidth: CANVAS_WIDTH,
                canvasHeight: CANVAS_HEIGHT,
                tree: {
                    depth: 10,
                    angle1: 35,
                    angle2: -35,
                    grow1: 800,
                    grow2: 800,
                }
            }
        },
        mounted(): void {
            const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
            this.canvas = canvasElement.getContext("2d");
            this.painter = new CanvasPainter(this.canvas);
            this.turtle = new TurtleModel(
                this.painter, [
                    this.canvasWidth / 2,
                    this.canvasHeight / 2 + 100
                ]);

            this.drawTurtle();
        },
        methods: {

            drawTree(size: number, level: number): void {
                if (level == 0) {
                    return;
                }
                const angle1 = Number(this.tree.angle1);
                const angle2 = Number(this.tree.angle2);
                const grow1 = Number(this.tree.grow1) / 1000;
                const grow2 = Number(this.tree.grow2) / 1000;
                this.turtle.move(size);
                this.turtle.turn(angle1);
                this.drawTree(grow1 * size, level - 1);
                this.turtle.turn(-angle1);

                this.turtle.turn(angle2);
                this.drawTree(grow2 * size, level - 1);
                this.turtle.turn(-angle2);
                this.turtle.move(-size);
            },

            drawTurtle(): void {

                this.canvas.fillStyle = "#000000";
                this.canvas.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.canvas.beginPath();

                this.turtle.reset();
                this.turtle.hide();
                this.turtle.turn(-90);
                this.turtle.move(200);
                this.turtle.turn(180);
                this.turtle.show();
                this.drawTree(150, Number(this.tree.depth));

                this.canvas.strokeStyle = "#FFFF00";
                this.canvas.stroke();
                this.canvas.closePath();
            }
        }
    })
</script>
