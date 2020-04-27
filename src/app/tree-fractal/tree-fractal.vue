<template lang="pug" src="./tree-fractal.pug"/>
<style lang="less" src="./tree-fractal.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";
    import {cloneDeep} from "lodash";
    import TreeWorker from "worker-loader!./tree-fractal.worker";
    import {TreeModel} from "./tree-model";

    const CANVAS_WIDTH = window.innerWidth - 7;
    const CANVAS_HEIGHT = window.innerHeight - 7;

    const INITIAL_TREE: TreeModel = {
        root: 1,
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
                    root: INITIAL_TREE.root * 100,
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
            window.addEventListener('resize', () => {
                this.repaintFractal();
            });
        },
        methods: {
            recalculateParameters(): void {
                this.tree.root = Number(this.inputTree.root) / 100;
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
                this.treeWorker.postMessage({
                    msg: 'draw',
                    tree: this.tree,
                    width: window.innerWidth - 7,
                    height: window.innerHeight - 7
                });
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
