<template lang="pug" src="./turtle.pug"/>
<style lang="less" src="./turtle.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";
    import {cloneDeep} from "lodash";
    import TreeWorker from "worker-loader!./tree.worker";
    import {Tree} from "./tree";

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 900;

    const INITIAL_TREE: Tree = {
        depth: 10,
        angle1: 35,
        angle2: -35,
        grow1: 0.8,
        grow2: 0.8,
    };

    interface Data {
        canvasWidth: number,
        canvasHeight: number,
        inputTree: Tree,
        tree: Tree,
        treeWorker: TreeWorker
    }

    export default Vue.extend({
        data(): Data {
            return {
                canvasWidth: CANVAS_WIDTH,
                canvasHeight: CANVAS_HEIGHT,
                inputTree: {
                    ...INITIAL_TREE,
                    grow1: INITIAL_TREE.grow1 * 1000,
                    grow2: INITIAL_TREE.grow2 * 1000
                },
                tree: cloneDeep(INITIAL_TREE),
                treeWorker: null
            }
        },
        mounted(): void {
            const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
            const offscreenCanvas: OffscreenCanvas = canvasElement.transferControlToOffscreen();
            this.treeWorker = new TreeWorker();
            this.treeWorker.postMessage({
                msg: 'init',
                canvas: offscreenCanvas,
                tree: this.tree
            }, [offscreenCanvas]);
        },
        methods: {

            recalculateParameters(): void {
                this.tree.angle1 = Number(this.inputTree.angle1);
                this.tree.angle2 = Number(this.inputTree.angle2);
                this.tree.grow1 = Number(this.inputTree.grow1) / 1000;
                this.tree.grow2 = Number(this.inputTree.grow2) / 1000;
                this.tree.depth = Number(this.inputTree.depth);
            },

            repaintFractal(): void {
                this.recalculateParameters();
                this.treeWorker.postMessage({msg: 'draw', tree: this.tree});
            },
        }
    })
</script>
