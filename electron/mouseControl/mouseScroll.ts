import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const desktop = new Hardware()

export async function scrollUp() {
    desktop.mouse.scrollWheel(10)
}

export async function scrollDown() {
    desktop.mouse.scrollWheel(-10)
}