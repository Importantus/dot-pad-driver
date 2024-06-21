import { createRequire } from 'node:module'
import { dispatch } from '../controller';

const require = createRequire(import.meta.url)

const firmata = require('firmata');
const pixel = require('node-pixel');

export let strip: any = null;

export function initBoard(port: string) {
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

        dispatch({ type: 'bootup' })
    });
}