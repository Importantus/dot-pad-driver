<script setup lang="ts">
import { UIState, UIStates } from '../../shared/constants';
import { AppWindowIcon, Mic, ScanEye } from 'lucide-vue-next';
import DotComponent from './DotComponent.vue';

const dots: UIState[] = [];

Object.keys(UIStates).forEach((key) => {
    if (UIStates[key].id !== 'uninitialized' && UIStates[key].id !== 'idle')
        dots.push(UIStates[key]);
});

const icons: { [key: string]: typeof AppWindowIcon } = {
    browsercontrol: AppWindowIcon,
    speechrecognition: Mic,
    facetracking: ScanEye
}

</script>

<template>
    <div class="flex w-full justify-between">
        <div v-for="i in dots" :key="i.id">
            <DotComponent :state="i" :icon="icons[i.id]" />
        </div>
    </div>
</template>