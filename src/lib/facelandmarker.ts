import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let facelandmaker = null as FaceLandmarker | null;

export function getFaceLandmarker() {
    return facelandmaker;
}

export async function loadFaceLandmarker() {
    facelandmaker = await createFaceLandmarker();
}

async function createFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    return await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
    });
}