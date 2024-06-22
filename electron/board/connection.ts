import { createRequire } from 'node:module'
import { dispatch } from '../controller';

const require = createRequire(import.meta.url)

const { usb } = require('usb')
const { SerialPort } = require('serialport');

const DEVICE_ID = '7523'
const VENDOR_ID = '1A86'

async function getBoard() {
    const ports = await SerialPort.list()
    for (const port of ports) {
        if (port.vendorId === VENDOR_ID && port.productId === DEVICE_ID) {
            return port
        }
    }
    return null
}

export async function initConnection() {
    const device = await getBoard()
    if (device) {
        dispatch({ type: 'connect', port: device.path })
    }

    usb.on('attach', async () => {
        const device = await getBoard()
        if (device) {
            dispatch({ type: 'connect', port: device.path })
        }
    })

    usb.on('detach', async () => {
        const device = await getBoard()
        if (!device) {
            dispatch({ type: 'disconnect' })
        }
    })
}