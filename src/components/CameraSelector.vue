<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../store';

const store = useStore();

const cameraDevices = ref<MediaDeviceInfo[]>([]);

const selectedCamera = computed({
    get: () => {
        return store.cameraInfo || cameraDevices.value[0];
    },
    set: (value: MediaDeviceInfo) => {
        store.setCameraId(value)
    }
});

async function loadCameraDevices() {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");
    cameraDevices.value = videoDevices;
}

loadCameraDevices();
</script>

<template>
    <select @click="loadCameraDevices()" v-model="selectedCamera" class="p-2 bg-gray-800 text-white rounded">
        <option v-for="device in cameraDevices" :key="device.deviceId" :value="device">
            {{ device.label }}
        </option>
    </select>
</template>