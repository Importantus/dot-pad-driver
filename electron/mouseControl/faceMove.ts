import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const desktop = new Hardware(null)

const screenSize = desktop.workwindow.getView()

export function handleFaceMove(event: Electron.IpcMainEvent, args: [number, number]) {
    const newX = screenSize.width * args[0]
    const newY = screenSize.height * args[1]
    desktop.mouse.moveTo(newX, newY)
    event.reply('face-move-reply', 'Roger that!')
}