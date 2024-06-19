import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const robot = require('robotjs')

export function rightClick() {
    robot.mouseClick('right')
}

export function leftClick() {
    robot.mouseClick('left')
}