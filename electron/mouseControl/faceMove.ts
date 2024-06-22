import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const robot = require('robotjs')

const screenSize = robot.getScreenSize()

export function handleFaceMove(event: Electron.IpcMainEvent, args: [number, number]) {
    const newX = screenSize.width * args[0]
    const newY = screenSize.height * args[1]
    robot.moveMouse(newX, newY)
    event.reply('face-move-reply', 'Roger that!')
}