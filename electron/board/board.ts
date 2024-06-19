// This example shows how to use node-pixel using firmata as the
// hook for the board.
import { createRequire } from 'node:module'
import { dispatch } from '../controller';

const require = createRequire(import.meta.url)

const firmata = require('firmata');
const pixel = require('node-pixel');

// const opts = {};
// if (process.argv[2] == undefined) {
//   console.log('Please supply a device port to connect to');
//   process.exit();
// }

const port = "COM10"

export let strip: any = null;

export function initBoard(onReady: () => void) {
    const board = new firmata.Board(port, function () {
        console.log('Firmata ready, lets add light');

        strip = new pixel.Strip({
            // @ts-ignore
            pin: 6,
            data: 6,
            length: 15,
            firmata: board
        });

        board.pinMode(10, board.MODES.INPUT);
        board.digitalRead(10, function (value: number) {
            if (value === 1 && strip) {
                // const stripColor = strip.pixel(0).color();
                // console.log(stripColor.hexcode);
                // if (stripColor.hexcode == '#007AFF') {
                //     strip.color('#000');
                // } else {
                //     strip.color('#007aff');
                // }
                // strip.show();
                dispatch({ type: 'btn_circ_right' })
            }
        });

        onReady();
    });
}