import { createRequire } from 'node:module'
import { ControllerAction, dispatch } from '../controller';

const require = createRequire(import.meta.url)

const firmata = require('firmata');
const pixel = require('node-pixel');

export let strip: any = null;

type Button = {
    pin: number;
    action: ControllerAction;
    prevValue: number;
}

const buttons: Button[] = [
    {
        pin: 12,
        action: { type: 'btn_rect_left' },
        prevValue: 1
    },
    {
        pin: 11,
        action: { type: 'btn_circ_left' },
        prevValue: 1
    },
    {
        pin: 10,
        action: { type: 'btn_semcirc_left' },
        prevValue: 1
    },
    {
        pin: 9,
        action: { type: 'btn_rect_center' },
        prevValue: 1
    },
    {
        pin: 8,
        action: { type: 'btn_semcirc_right' },
        prevValue: 1
    },
    {
        pin: 7,
        action: { type: 'btn_circ_right' },
        prevValue: 1
    },
    {
        pin: 5,
        action: { type: 'btn_semcirc_right_up' },
        prevValue: 1
    },
    {
        pin: 4,
        action: { type: 'btn_semcirc_right_down' },
        prevValue: 1
    }
]

type RotateEncoder = {
    pinA: number;
    pinB: number;
    valueA: number;
    valueB: number;
    prevValueA: number;
    prevValueB: number;
    actionCW: ControllerAction;
    actionCCW: ControllerAction;
}

const encoders: RotateEncoder[] = [
    {
        pinA: 2,
        pinB: 3,
        valueA: 1,
        valueB: 1,
        prevValueA: 0,
        prevValueB: 0,
        actionCW: { type: 'rot_right_cw' },
        actionCCW: { type: 'rot_right_ccw' }
    }
]

export function initBoard(port: string) {
    const board = new firmata.Board(port, function () {
        strip = new pixel.Strip({
            // @ts-ignore
            pin: 6,
            data: 6,
            length: 11,
            firmata: board
        });

        for (let button of buttons) {
            board.pinMode(button.pin, board.MODES.PULLUP);
            board.digitalRead(button.pin, function () {
                setTimeout(() => {
                    let value = board.pins[button.pin].value;
                    if (value === 1 && button.prevValue === 0) {
                        console.log('Button pressed', button.pin)
                        dispatch(button.action);
                    }
                    button.prevValue = value;
                }, 2)
            });
        }

        for (let encoder of encoders) {
            board.pinMode(encoder.pinA, board.MODES.INPUT);
            board.pinMode(encoder.pinB, board.MODES.INPUT);
            board.digitalRead(encoder.pinA, function (value: number) {
                encoder.valueA = value;
            });
            board.digitalRead(encoder.pinB, function (value: number) {
                encoder.valueB = value;
                checkScrollDirection(encoder);
            });
        }

        dispatch({ type: 'bootup' })
    });
}

function checkScrollDirection(encoder: RotateEncoder) {
    if (encoder.prevValueA === 0 && encoder.prevValueB === 0) {
        if (encoder.valueA === 1 && encoder.valueB === 0) {
            dispatch(encoder.actionCW);
        } else if (encoder.valueA === 0 && encoder.valueB === 1) {
            dispatch(encoder.actionCCW);
        }
    } else if (encoder.prevValueA === 1 && encoder.prevValueB === 1) {
        if (encoder.valueA === 0 && encoder.valueB === 1) {
            dispatch(encoder.actionCW);
        } else if (encoder.valueA === 1 && encoder.valueB === 0) {
            dispatch(encoder.actionCCW);
        }
    }
    encoder.prevValueA = encoder.valueA;
    encoder.prevValueB = encoder.valueB;
}