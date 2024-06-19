import { win } from "../main"

function send(channel: string, ...args: any[]) {
    if (!win) {
        console.log('No window to send message to')
        return
    }
    win.webContents.send(channel, ...args)
}

export function sendColor(color: string) {
    console.log('Sending color', color)
    send('color', color)
}

export function sendStartFaceTracking() {
    console.log('Sending start face tracking')
    send('start-face-tracking')
}

export function sendStopFaceTracking() {
    console.log('Sending stop face tracking')
    send('stop-face-tracking')
}

export function sendReady() {
    console.log('Sending ready')
    send('ready')
}