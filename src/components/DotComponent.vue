<script setup lang="ts">
import { HelpCircle } from 'lucide-vue-next';
import { UIState } from '../../shared/constants';
import { useStore } from '../store';

const store = useStore();

defineProps<{
    state: UIState;
    icon: typeof HelpCircle
}>();
</script>

<template>
    <div class="flex flex-col gap-2 items-center transition-all duration-300 ease-in-out" :style="{
        scale: store.state.id === state.id ? 1.2 : 1
    }">
        <div class="w-20 h-20 rounded-full flex justify-center items-center" :style="{
        backgroundColor: state.color
    }">
            <icon class="text-black" :size="30" />
        </div>
        <div class="text-center text-xs text-gray-400">{{ state.title }}</div>
    </div>
</template>