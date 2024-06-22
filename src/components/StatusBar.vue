<script setup lang="ts">
import { useStore } from '../store';

const store = useStore();
</script>
<template>
    <div class="w-full h-2" :style="{
        backgroundColor: store.state.color,
        boxShadow: `0px -2px 27.15px 0px ${store.state.color}80`
    }"></div>
</template>

<style scoped>
div {
    height: env(titlebar-area-height, 33px);
    -webkit-app-region: drag;
    app-region: drag;
}
</style>