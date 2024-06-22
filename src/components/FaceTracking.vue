<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from '../store';
import { UIStates } from '../../shared/constants';
import { getFaceLandmarker } from '../lib/facelandmarker';

const store = useStore();

let video: HTMLVideoElement | null = null

let webcamRunning = ref(false);

let predictionRunning = ref(false);

const facelandmaker = getFaceLandmarker();

watch(store, () => {
    if (store.state.id === UIStates.facetracking.id) {
        if (!predictionRunning.value) {
            console.log("Starting face tracking prediction.");
            predictWebcam();
        }
    }
});

onMounted(() =>
    enableCam()
)

// Enable the live webcam view and start detection.
function enableCam() {
    if (!video) {
        console.log("Wait! Video not loaded yet.");
        video = document.getElementById("video") as HTMLVideoElement;
        window.requestAnimationFrame(enableCam);
        return;
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
        if (debugOverrideCamIndex > -1) {
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
            webcamRunning.value = true;
        });
    });
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
    if (!facelandmaker || store.state.id !== UIStates.facetracking.id) {
        console.log("Facelandmaker not ready or not in facetracking mode.")
        predictionRunning.value = false;
        return;
    }

    predictionRunning.value = true;

    if (video && video.srcObject && webcamRunning.value) {
        // Now let's start detecting the stream.

        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            results = facelandmaker.detectForVideo(video, startTimeMs);
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
    }

    // Call this function again to keep predicting when the browser is ready.
    if (store.state.id === UIStates.facetracking.id) {
        window.requestAnimationFrame(predictWebcam);
    } else {
        predictionRunning.value = false;
    }
}
</script>

<template>
    <div>
        <div class="w-full max-w-full aspect-video overflow-hidden rounded-md">
            <video class="w-full min-h-full -scale-x-100" id="video" autoplay></video>
        </div>
    </div>
</template>
