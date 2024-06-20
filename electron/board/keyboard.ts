// This example shows how to use node-pixel using firmata as the
// hook for the board.
import { dispatch } from '../controller';
import { globalShortcut } from 'electron';

export function initKeyboard(onReady: () => void) {
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
    onReady();
}