<script setup lang="ts">
import { Cable } from 'lucide-vue-next'
</script>

<template>
    <div class="w-full h-screen pb-16 flex flex-col justify-center items-center gap-5">
        <div class="w-24 h-24 bg-white flex justify-center items-center rounded-full">
            <Cable :size="40" class="text-black" />
        </div>
        <div class="flex flex-col gap-2 justify-center items-center max-w-44 text-center">
            <div class="font-medium text-lg">No pad connected</div>
            <div class="text-sm text-gray-500">Plug in your dotpad and start browsing</div>
        </div>

    </div>
</template>