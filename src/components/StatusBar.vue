<script setup lang="ts">
import { useStore } from '../store';

const store = useStore();
</script>
<template>
    <div class="w-full h-2" :style="{
        backgroundColor: store.state.color
    }"></div>
</template>