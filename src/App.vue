<script setup lang="ts">
import FaceTracking from './components/FaceTracking.vue';
import StatusBar from './components/StatusBar.vue';
import { Connection, useStore } from './store';

const store = useStore();
store.init();
</script>

<template>
  <div class="w-screen h-screen overflow-hidden text-white">
    <StatusBar />
    <div class="p-5">
      <div v-if="store.connection === Connection.DISCONNECTED">Not connected</div>
      <div v-else-if="store.connection === Connection.LOADING || !store.frontendLoaded">Connecting...</div>
      <div v-else-if="store.connection === Connection.READY && store.frontendLoaded">
        <FaceTracking />
      </div>
    </div>
  </div>
</template>