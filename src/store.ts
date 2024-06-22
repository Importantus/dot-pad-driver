import { defineStore } from 'pinia'
import { UIState, UIStates } from '../shared/constants'
import { getFaceLandmarker, loadFaceLandmarker } from './lib/facelandmarker';

export enum Connection {
    DISCONNECTED,
    LOADING,
    READY
}

export const useStore = defineStore({
    id: 'main',
    state: () => ({
        connection: Connection.DISCONNECTED,
        frontendLoaded: false,
        state: UIStates.uninitialized,
        initialized: false,
        cameraInfo: JSON.parse(localStorage.getItem("cameraInfo") || "null") as MediaDeviceInfo | null
    }),
    actions: {
        async init() {
            if (this.initialized) {
                return;
            }
            window.ipcRenderer.on("state-change", (_, state: any) => {
                console.log("State change:", state);
                this.state = state as UIState;
            });

            window.ipcRenderer.on("ready", () => {
                console.log("Backend is ready.");
                this.connection = Connection.READY;
            });

            window.ipcRenderer.on("board-connected", () => {
                console.log("Board connected.");
                this.connection = Connection.LOADING;
            });

            window.ipcRenderer.on("board-disconnected", () => {
                console.log("Board disconnected.");
                this.connection = Connection.DISCONNECTED;
            });

            if (getFaceLandmarker() === null) {
                await loadFaceLandmarker();
            }

            this.initialized = true;
            this.frontendLoaded = true;
        },
        setCameraId(cameraInfo: MediaDeviceInfo) {
            this.cameraInfo = cameraInfo;
            localStorage.setItem("cameraInfo", JSON.stringify(cameraInfo));
        }
    },
})