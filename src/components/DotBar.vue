<script setup lang="ts">
import { UIState, UIStates } from '../../shared/constants';
import { AppWindowIcon, Mic, ScanEye } from 'lucide-vue-next';
import { useStore } from '../store';

const store = useStore();

const dots: UIState[] = [];

Object.keys(UIStates).forEach((key) => {
    if (UIStates[key].id !== 'uninitialized' && UIStates[key].id !== 'idle')
        dots.push(UIStates[key]);
});

</script>

<template>
    <div class="flex w-full justify-between">
        <div v-for="state in dots" :key="state.id">
            <div class="flex flex-col gap-2 items-center transition-all duration-300 ease-in-out" :style="{
            scale: store.state.id === state.id ? 1.2 : 1
        }">
                <div class="w-20 h-20 rounded-full flex justify-center items-center" :style="{
            backgroundColor: state.color
        }">
                    <AppWindowIcon v-if="state.id === 'browsercontrol'" class="text-black" :size="30" />
                    <Mic v-else-if="state.id === 'speechrecognition'" class="text-black" :size="30" />
                    <ScanEye v-else-if="state.id === 'facetracking'" class="text-black" :size="30" />
                </div>
                <div class="text-center text-xs text-gray-400">{{ state.title }}</div>
            </div>
        </div>
    </div>
</template>