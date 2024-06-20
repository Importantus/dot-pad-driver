import { dispatch } from '../controller';
import { globalShortcut } from 'electron';
let registeredKeys = false;

//TODO: Probably a better way to do this, but whatever
function registerKeyboardEvents() {

    if (registeredKeys) {
        console.log('Removing keyboard debug event listeners...');
        globalShortcut.unregister('num1');
        globalShortcut.unregister('num2');
        globalShortcut.unregister('num4');
        globalShortcut.unregister('num5');
        globalShortcut.unregister('num6');
        globalShortcut.unregister('num7');
        globalShortcut.unregister('num8');
        globalShortcut.unregister('num9');
        registeredKeys = false;
        return;
    }
    console.log('Adding keyboard debug event listeners...');

    globalShortcut.register('num1', () => {
        dispatch({ type: 'btn_rect_left' })
    });
    globalShortcut.register('num2', () => {
        dispatch({ type: 'btn_circ_left' })
    });
    globalShortcut.register('num4', () => {
        dispatch({ type: 'btn_semcirc_left' })
    });
    //TODO: Enable Keyboard center button shortcut
    // globalShortcut.register('num5', () => {
    //     dispatch({ type: 'btn_rect_center' })
    // });
    globalShortcut.register('num6', () => {
        dispatch({ type: 'btn_semcirc_right' })
    });
    globalShortcut.register('num7', () => {
        dispatch({ type: 'btn_circ_right' })
    });
    globalShortcut.register('num8', () => {
        dispatch({ type: 'btn_semcirc_right_up' })
    });
    globalShortcut.register('num9', () => {
        dispatch({ type: 'btn_semcirc_right_down' })
    });
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