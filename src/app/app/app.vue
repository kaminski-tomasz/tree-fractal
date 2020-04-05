<template lang="pug" src="./app.pug"/>
<style lang="less" src="./app.less" scoped="scoped"/>
<script lang="ts">
    import Vue from "vue";
    import Turtle from "../turtle/turtle.vue";
    export default Vue.extend({
        components: {
            'turtle': Turtle
        }
    })
</script>