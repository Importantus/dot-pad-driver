import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const desktop = new Hardware()

export function rightClick() {
    desktop.mouse.click('right')
}

export function leftClick() {
    desktop.mouse.click('left')
}