import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const desktop = new Hardware()

const SCROLL_VALUE = 50

export async function scrollUp() {
    desktop.mouse.scrollWheel(SCROLL_VALUE)
}

export async function scrollDown() {
    desktop.mouse.scrollWheel(-SCROLL_VALUE)
}