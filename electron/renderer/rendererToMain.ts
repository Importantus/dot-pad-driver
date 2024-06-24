import { ipcMain } from "electron";
import { handleFaceMove } from "../mouseControl/faceMove";
// import { dispatch } from "../controller";

let registered = false;

export function registerRendererEvents() {
    if (registered) return;

    ipcMain.on("face-move", handleFaceMove);

    registered = true;

    // ipcMain.on("start-face-tracking", () => {
    //     console.log('Start eye tracking | ')
    //     dispatch({ type: "btn_circ_right" });
    // });

    // ipcMain.on("stop-face-tracking", () => {
    //     console.log('Stop eye tracking | ')
    //     dispatch({ type: "btn_circ_right" });
    // });
}