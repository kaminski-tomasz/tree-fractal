<template lang="pug" src="./turtle.pug"/>
<style lang="less" src="./turtle.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";
    import {Painter, TurtleModel} from "./turtle.model";
    import { cloneDeep } from "lodash";

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 900;

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

    interface Tree {
        depth: number,
        angle1: number,
        angle2: number,
        grow1: number,
        grow2: number,
    }

    const INITIAL_TREE: Tree = {
        depth: 10,
        angle1: 35,
        angle2: -35,
        grow1: 800,
        grow2: 800,
    };

    interface Data {
        canvas: CanvasRenderingContext2D,
        painter: CanvasPainter,
        turtle: TurtleModel,
        canvasWidth: number,
        canvasHeight: number,
        inputTree: Tree,
        tree: Tree,
    }

    export default Vue.extend({
        data(): Data {
            return {
                canvas: null,
                painter: null,
                turtle: null,
                canvasWidth: CANVAS_WIDTH,
                canvasHeight: CANVAS_HEIGHT,
                inputTree: cloneDeep(INITIAL_TREE),
                tree: cloneDeep(INITIAL_TREE),
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
            this.drawCanvas();
        },
        methods: {

            getColor(level: number, maxDepth: number): string {
                const minFraction = 0.06;
                const opacity = minFraction + (1 - minFraction) * (level / maxDepth);
                return `rgba(255, 255, 255, ${opacity})`;
            },

            recalculateParameters(): void {
                this.tree.angle1 = Number(this.inputTree.angle1);
                this.tree.angle2 = Number(this.inputTree.angle2);
                this.tree.grow1 = Number(this.inputTree.grow1) / 1000;
                this.tree.grow2 = Number(this.inputTree.grow2) / 1000;
                this.tree.depth = Number(this.inputTree.depth);
            },

            drawTree(size: number, level: number): void {
                if (level == 0) {
                    return;
                }
                const color = this.getColor(level, this.tree.depth);
                this.turtle.move(size);
                [
                    // Try this three branches
                    // [50, 0.5],
                    // [-55, 0.4],
                    // [7, 0.80]
                    [this.tree.angle1, this.tree.grow1],
                    [this.tree.angle2, this.tree.grow2]
                ].forEach(([angle, grow]) => {
                    this.turtle.turn(angle);
                    this.drawTree(grow * size, level - 1);
                    this.turtle.turn(-angle);
                });
                this.turtle.setColor(color);
                this.turtle.show();
                this.turtle.move(-size);
                this.turtle.hide();
            },

            drawCanvas(): void {
                this.clearCanvas();
                this.recalculateParameters();
                this.turtle.reset();
                this.turtle.hide();
                this.turtle.turn(-90);
                this.turtle.move(200);
                this.turtle.turn(180);
                // this.turtle.show();
                this.drawTree(150, this.tree.depth);
            },

            clearCanvas: function () {
                this.canvas.fillStyle = "#000000";
                this.canvas.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            }
        }
    })
</script>
