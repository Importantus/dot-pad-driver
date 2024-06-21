import { ControllerAction, dispatch } from '../controller';
import { globalShortcut } from 'electron';

let registeredKeys = false;

const keyMap: { [key: string]: ControllerAction } = {
    'num1': { type: 'btn_rect_left' },
    'num2': { type: 'btn_circ_left' },
    'num4': { type: 'btn_semcirc_left' },
    // 'num5': { type: 'btn_rect_center' },
    'num6': { type: 'btn_semcirc_right' },
    'num7': { type: 'btn_circ_right' },
    'num8': { type: 'btn_semcirc_right_up' },
    'num9': { type: 'btn_semcirc_right_down' },
}

function registerKeyboardEvents() {

    if (registeredKeys) {
        console.log('Removing keyboard debug event listeners...');
        for (const key in keyMap) {
            globalShortcut.unregister(key);
        }
        registeredKeys = false;
        return;
    }

    console.log('Adding keyboard debug event listeners...');

    for (const key in keyMap) {
        globalShortcut.register(key, () => {
            console.log('Key pressed:', key);
            dispatch(keyMap[key]);
        });
    }

    registeredKeys = true;
}

export function initKeyboard(onReady: () => void) {
    globalShortcut.register('nummult', () => {
        registerKeyboardEvents();
    });
    if (process.env.DEBUG_KEYBOARD_INPUT_MODE_AUTO_REGISTER) {
        registerKeyboardEvents();
    }
    onReady();
}