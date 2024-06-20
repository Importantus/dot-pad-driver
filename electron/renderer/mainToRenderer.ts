import { win } from "../main"

let messageQueue: { channel: string, args: any[] }[] = [];
let isWebContentsLoaded = false;

function send(channel: string, ...args: any[]) {
    if (!win) {
        console.log('No window to send message to')
        return
    }
    console.log('Sending', channel, ...args)

    if (isWebContentsLoaded) {
        console.log('Sending immediately:', channel, ...args);
        win.webContents.send(channel, ...args);
    } else {
        console.log('Queueing message:', channel, ...args);
        messageQueue.push({ channel, args });
    }

    // Listen for 'did-finish-load' event
    win.webContents.on('did-finish-load', function () {
        isWebContentsLoaded = true;
        console.log('Web contents finished loading.');

        // Process the message queue
        while (messageQueue.length > 0) {
            const { channel, args } = messageQueue.shift()!;
            console.log('Sending queued message:', channel, ...args);
            win?.webContents.send(channel, ...args);
        }
    });
}

export function sendColor(color: string) {
    send('color', color)
}

export function sendStartFaceTracking() {
    send('start-face-tracking')
}

export function sendStopFaceTracking() {
    send('stop-face-tracking')
}

export function sendReady() {
    send('ready')
}