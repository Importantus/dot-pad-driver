import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const desktop = new Hardware()

export function tabForward() {
    desktop.keyboard.sendKey('tab');
}

export function tabBackward() {
    desktop.keyboard.sendKey(['shift', 'tab']);
}