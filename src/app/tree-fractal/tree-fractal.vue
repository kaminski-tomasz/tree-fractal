<template lang="pug" src="./tree-fractal.pug"/>
<style lang="less" src="./tree-fractal.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";
    import {cloneDeep} from "lodash";
    import TreeWorker from "worker-loader!./tree-fractal.worker";
    import {TreeModel} from "./tree-model";

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 900;

    const INITIAL_TREE: TreeModel = {
        depth: 10,
        angle1: 35,
        angle2: -35,
        grow1: 0.8,
        grow2: 0.8,
    };

    export default Vue.extend({
        data(): any {
            return {
                canvasWidth: CANVAS_WIDTH,
                canvasHeight: CANVAS_HEIGHT,
                offscreenCanvas: null,
                inputTree: {
                    ...INITIAL_TREE,
                    grow1: INITIAL_TREE.grow1 * 1000,
                    grow2: INITIAL_TREE.grow2 * 1000
                },
                tree: cloneDeep(INITIAL_TREE),
                treeWorker: null,
                isDrawing: false,
                shouldRedraw: false
            }
        },

        mounted(): void {
            const canvasElement = document.getElementById("tree-fractal__canvas") as HTMLCanvasElement;
            this.offscreenCanvas = canvasElement.transferControlToOffscreen();
            this.treeWorker = new TreeWorker();
            this.treeWorker.addEventListener('message', (e: MessageEvent) => {
                if (e.data.msg === 'finished') {
                    this.drawingFinished();
                }
            });
            this.treeWorker.postMessage({
                msg: 'init',
                canvas: this.offscreenCanvas,
                tree: this.tree
            }, [this.offscreenCanvas]);
            // TODO resizing canvas
            window.addEventListener('resize', () => {
                this.resizeCanvas();
            });
        },
        methods: {
            resizeCanvas() {
                // TODO resizing canvas
                // this.canvasHeight  = window.innerHeight * 0.8;
                // this.canvasWidth  = window.innerWidth * 0.6;
                this.treeWorker.postMessage({
                    msg: 'resize',
                    tree: this.tree,
                    width: window.innerWidth * 0.6,
                    height: window.innerHeight * 0.8
                });
            },
            recalculateParameters(): void {
                this.tree.angle1 = Number(this.inputTree.angle1);
                this.tree.angle2 = Number(this.inputTree.angle2);
                this.tree.grow1 = Number(this.inputTree.grow1) / 1000;
                this.tree.grow2 = Number(this.inputTree.grow2) / 1000;
                this.tree.depth = Number(this.inputTree.depth);
            },
            drawingStarted() {
                this.isDrawing = true;
            },
            drawingFinished() {
                this.isDrawing = false;
                if (this.shouldRedraw) {
                    this.shouldRedraw = false;
                    this.sendDrawRequest();
                }
            },
            scheduleDraw() {
                this.shouldRedraw = true;
            },
            sendDrawRequest() {
                this.drawingStarted();
                this.treeWorker.postMessage({msg: 'draw', tree: this.tree});
            },
            repaintFractal(): void {
                this.recalculateParameters();
                if (!this.isDrawing) {
                    this.sendDrawRequest();
                } else {
                    this.scheduleDraw();
                }
            },
        }
    })
</script>
