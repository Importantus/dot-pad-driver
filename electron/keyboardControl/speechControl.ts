import { createRequire } from 'node:module'
import { exec } from 'child_process'


const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')
const speechProcessName = 'TextInputHost.exe'

const killCommand = `taskkill /IM ${speechProcessName} /F`

const desktop = new Hardware()

export function startWindowsSpeech() {
    desktop.keyboard.sendKey(['lWin', 'h']);
}

export function stopWindowsSpeech() {
    exec(killCommand, (err, stdout) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(stdout)
    })
}

