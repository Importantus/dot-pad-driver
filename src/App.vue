<script setup lang="ts">
import DotBar from './components/DotBar.vue';
import FaceTracking from './components/FaceTracking.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import NotConnected from './components/NotConnected.vue';
import StatusBar from './components/StatusBar.vue';
import { Connection, useStore } from './store';

const store = useStore();
store.init();
</script>

<template>
  <div class="w-screen h-screen overflow-hidden text-white bg-[#131313]">
    <StatusBar />
    <div v-if="store.keyboardDebug">
      <div class="fixed p-2 bg-red-900 text-white text-xs -rotate-45 z-10 w-40 text-center -left-9">
        Debug mode
      </div>
    </div>
    <div class="px-8 overflow-hidden">
      <TransitionGroup name="rotate" tag="div">
        <div v-if="store.connection === Connection.DISCONNECTED">
          <NotConnected />
        </div>
        <div v-else-if="store.connection === Connection.LOADING || !store.frontendLoaded">
          <LoadingScreen />
        </div>
        <div v-else-if="store.connection === Connection.READY && store.frontendLoaded">
          <DotBar class="mt-8 mb-16" />
          <FaceTracking />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.rotate-move,
/* apply transition to moving elements */
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease;
  z-index: 1;
}

.rotate-enter-from {
  opacity: 0;
  transform: translateX(80%);
}

.rotate-leave-to {
  opacity: 0;
  transform: translateX(-80%)
}
</style>