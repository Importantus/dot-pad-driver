import { UIState } from "../../shared/constants";
import { win } from "../main"

let messageQueue: { channel: string, args: any[] }[] = [];

function send(channel: string, ...args: any[]) {
    if (!win) {
        console.log('No window to send message to')
        return
    }
    // Only set up the listener once
    if (win.webContents.isLoading() && messageQueue.length === 0) {
        // Listen for 'did-finish-load' event
        console.log('Setting up did-finish-load listener')
        win.webContents.on('did-finish-load', function () {
            console.log('Web contents finished loading.');

            // Process the message queue
            while (messageQueue.length > 0) {
                const { channel, args } = messageQueue.shift()!;
                console.log('Sending queued message:', channel, ...args);
                win?.webContents.send(channel, ...args);
            }
        });
    }

    console.log('Sending', channel, ...args)

    if (!win.webContents.isLoading()) {
        console.log('Sending immediately:', channel, ...args);
        win.webContents.send(channel, ...args);
    } else {
        console.log('Queueing message:', channel, ...args);
        messageQueue.push({ channel, args });
    }
}

export function sendColor(color: string) {
    send('color', color)
}

export function sendState(state: UIState) {
    send('state-change', state)
}

export function sendReady() {
    send('ready')
}

export function sendConntect() {
    send('board-connected')
}

export function sendDisconnect() {
    send('board-disconnected')
}