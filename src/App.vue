<script setup lang="ts">
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { ref, watch } from 'vue';

const videoWidth = 640;
const loading = ref(true);
const backendReady = ref(false);
const webcamRunning = ref(false);
let video: HTMLVideoElement | null = null

let faceLandmarker: FaceLandmarker | null = null;

watch(loading, (value) => {
  if (value === false) {
    video = document.getElementById("video") as HTMLVideoElement;
    video.addEventListener("loadeddata", () => {
      // window.ipcRenderer.send("start-face-tracking");
      predictWebcam();
    });
  }
});

window.ipcRenderer.on("stop-face-tracking", () => {
  console.log("Stop face tracking.");
  disableCam();
});

window.ipcRenderer.on("start-face-tracking", () => {
  console.log("Start face tracking.");
  enableCam();
});

window.ipcRenderer.on("ready", () => {
  console.log("Backend is ready.");
  backendReady.value = true;
});

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1
  });

  loading.value = false;
}

// Enable the live webcam view and start detection.
function enableCam() {
  if (!video) {
    console.log("Wait! Video not loaded yet.");
    return;
  }

  if (!faceLandmarker) {
    console.log("Wait! faceLandmarker not loaded yet.");
    return;
  }

  if (webcamRunning.value === true) {
    webcamRunning.value = false;
  } else {
    webcamRunning.value = true;
  }

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    if (videoDevices.length === 0) {
      console.log("No video devices found.");
      return;
    }

    //TODO: Make a way to select the camera device.
    let videoDevice = videoDevices[0];

    //Debugging: Force override the camera device.
    let debugOverrideCamIndex = import.meta.env.VITE_DEBUG_OVERRIDE_WEBCAM_DEVICE_ID; 
    if (debugOverrideCamIndex > -1){
        console.log("DEBUG: Overriding camera device with index: ", debugOverrideCamIndex);
        videoDevice = videoDevices[debugOverrideCamIndex];
    }
  
    console.log("Using video device: ", videoDevice.label);

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDevice.deviceId,
      },
      audio: false
    }).then((stream) => {
      if (!video) {
        console.log("Wait! Video not loaded yet.");
        return;
      }
      video.srcObject = stream;
    });
  });
}

function disableCam() {
  if (video) {
    video.srcObject = null;
    // window.ipcRenderer.send("stop-face-tracking");
  }
  webcamRunning.value = false;
}

function toggleCam() {
  if (webcamRunning.value === true) {
    disableCam();
  } else {
    enableCam();
  }
}

function resetFacePostition() {
  leftFaceSide.value = 0.4;
  rightFaceSide.value = 0.6;
  topFaceSide.value = 0.2;
  bottomFaceSide.value = 0.8;
}

let lastVideoTime = -1;
let results: any = undefined;

let leftFaceSide = ref(0.4);
let rightFaceSide = ref(0.6);
let topFaceSide = ref(0.2);
let bottomFaceSide = ref(0.8);

async function predictWebcam() {
  if (!faceLandmarker) {
    return;
  }

  if (!video || !video.srcObject || !webcamRunning.value) {
    console.log("Wait! Video not loaded");
    return;
  }

  const radio = video.videoHeight / video.videoWidth;
  video.style.width = videoWidth + "px";
  video.style.height = videoWidth * radio + "px";

  // Now let's start detecting the stream.

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = faceLandmarker.detectForVideo(video, startTimeMs);
  }
  if (results.faceLandmarks) {
    const landmarks = results.faceLandmarks[0];

    /*
      The way this works is that we grab and save the position of the left and right side of the face and the top and bottom side of the face
      when the face is detected for the first time.
      Then, we calculate the movement of the nose in the x and y axis in relation to the face.
      Finally, we send this information to the main process to move the mouse.
    */

    if (landmarks) {
      const nose = landmarks[4];

      /* 
        Actually, landmark 352 is on the right side of the face and landmark 123 is on the left side of the face.
        But, the camera is mirrored, so the right side of the face is on the left side of the camera and vice versa.
        For all landmarks, see https://storage.googleapis.com/mediapipe-assets/documentation/mediapipe_face_landmark_fullsize.png
      */
      if (leftFaceSide.value === 0.4) {
        leftFaceSide.value = landmarks[352].x;
      }

      if (rightFaceSide.value === 0.6) {
        rightFaceSide.value = landmarks[123].x;
      }

      if (topFaceSide.value === 0.2) {
        topFaceSide.value = landmarks[6].y;
      }

      if (bottomFaceSide.value === 0.8) {
        bottomFaceSide.value = landmarks[0].y;
      }

      /*
      Here we calculate the movement of the nose in relation to our saved face sides. The result is a number between 0 and 1.
      */
      const noseMovementX = (nose.x - leftFaceSide.value) / (rightFaceSide.value - leftFaceSide.value);
      const noseMovementY = (nose.y - topFaceSide.value) / (bottomFaceSide.value - topFaceSide.value);

      // @ts-ignore
      window.ipcRenderer.send("face-move", [noseMovementX, noseMovementY]);
    }
  }

  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning.value === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}

createFaceLandmarker();
</script>

<template>
  <div>
    <div v-if="loading || !backendReady">Loading...</div>
    <div v-if="!loading && backendReady">All ready!</div>
    <div>
      <div>
        <video id="video" autoplay></video>
      </div>
      <!-- <div>
        <button v-if="!loading" @click="toggleCam">{{
      webcamRunning ? 'Stop' : 'Start'
    }} Facetracking</button>
        <button v-if="!loading" @click="resetFacePostition">Reset Face Position</button>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
#video {
  transform: scaleX(-1);
  width: 100%;
  height: auto;
  /* visibility: hidden; */
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
