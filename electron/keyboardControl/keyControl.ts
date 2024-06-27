import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const desktop = new Hardware()

export function pressEnter() {
    desktop.keyboard.sendKey('enter');
}