import { match, P } from 'ts-pattern';
import { leftClick, rightClick } from './mouseControl/mouseClick';
import { showBootupAnimation, showColor, showShutdownAnimation } from './board/strip';
import { Colors, UIStates } from '../shared/constants';
import { sendConntect, sendDisconnect, sendReady, sendState } from './renderer/mainToRenderer';
import { initBoard } from './board/board';
import { registerRendererEvents } from './renderer/rendererToMain';
import { scrollDown, scrollUp } from './mouseControl/mouseScroll';

type ControllerState =
    | { type: 'disconnected' }
    | { type: 'uninitialized' }
    | { type: 'idle' }
    | { type: 'browsercontrol' }
    | { type: 'eytracking' }
    | { type: 'speechrecognition' }

export type ControllerAction =
    | { type: 'disconnect' }
    | { type: 'connect'; port: string }
    | { type: 'bootup' }
    | { type: 'shutdown' }
    | { type: 'btn_rect_left' }
    | { type: 'btn_circ_left' }
    | { type: 'btn_semcirc_left' }
    | { type: 'btn_semcirc_right' }
    | { type: 'btn_circ_right' }
    | { type: 'btn_semcirc_right_up' }
    | { type: 'btn_semcirc_right_down' }
    | { type: 'rot_right_cw' } // Rotate right clockwise
    | { type: 'rot_right_ccw' } // Rotate right counter clockwise



let state: ControllerState = process.env.DEBUG_KEYBOARD_INPUT_MODE === 'true' ? { type: 'uninitialized' } : { type: 'disconnected' }

export function dispatch(action: ControllerAction) {
    state = stateReducer(state, action)
}

function stateReducer(state: ControllerState, action: ControllerAction): ControllerState {
    return match<[ControllerState, ControllerAction], ControllerState>([state, action])
        .with([{ type: 'disconnected' }, { type: 'connect' }], ([_, action]) => {
            console.log('Connect controller')
            // Send connected to frontend
            sendConntect()
            // Initialize board
            initBoard(action.port)
            return { type: 'uninitialized' }
        })
        .with([{ type: P.not('disconnected') }, { type: 'disconnect' }], ([_]) => {
            console.log('Disconnect controller')
            // Send disconnected to frontend
            sendDisconnect()
            // Send uninitialized to frontend
            sendState(UIStates.uninitialized)
            return { type: 'disconnected' }
        })
        .with([{ type: P.not('disconnected') }, { type: 'connect' }], ([state]) => {
            console.error('Controller is already connected. Disconnect first.')
            return state
        })
        .with([{ type: 'disconnected' }, { type: P.not('connect') }], ([state]) => {
            console.error('Controller is disconnected. Connect first.')
            return state
        })
        .with([{ type: 'uninitialized' }, { type: 'bootup' }], ([_]) => {
            console.log('Initialize controller')
            // Register renderer events (e.g. face tracking)
            registerRendererEvents()
            // Show bootup animation on lightstrip
            showBootupAnimation();
            // Send ready to backend
            sendReady()
            // Send idle to frontend
            sendState(UIStates.idle)
            return { type: 'idle' }
        })
        .with([{ type: 'uninitialized' }, { type: 'shutdown' }], ([_]) => {
            console.error('Controller is already uninitialized. Bootup first.')
            return { type: 'uninitialized' }
        })
        .with([{ type: P.not('uninitialized') }, { type: 'shutdown' }], ([_]) => {
            console.log('Shutdown controller')
            // Show shutdown animation on lightstrip
            showShutdownAnimation();
            return { type: 'uninitialized' }
        })
        .with([{ type: P.not('uninitialized') }, { type: 'bootup' }], ([state]) => {
            console.error('Controller is already initialized. Shutdown first.')
            return state
        })
        .with([{ type: 'uninitialized' }, { type: P.not('bootup') }], ([_]) => {
            console.error('Controller is uninitialized. Bootup first.')
            return { type: 'uninitialized' }
        })
        .with([{ type: P.union('idle', 'eytracking', 'speechrecognition') }, { type: 'btn_rect_left' }], ([_]) => {
            // TODO: Launch Browser 
            // TODO: Change color of lightstrip to indicate browser control
            // Send browser control to frontend
            sendState(UIStates.browsercontrol)
            return { type: 'browsercontrol' }
        })
        .with([{ type: P.union('idle', 'eytracking') }, { type: 'btn_circ_left' }], ([_]) => {
            // TODO: Start speech recognition
            // TODO: Change color of lightstrip to indicate speech recognition
            // Send speech recognition to frontend
            sendState(UIStates.speechrecognition)
            return { type: 'speechrecognition' }
        })
        .with([{ type: P.union('idle', 'eytracking', 'speechrecognition') }, { type: 'btn_semcirc_left' }], ([_]) => {
            leftClick()
            return { type: 'idle' }
        })
        .with([{ type: P.union('idle', 'eytracking', 'speechrecognition') }, { type: 'btn_semcirc_right' }], ([_]) => {
            rightClick()
            return { type: 'idle' }
        })
        .with([{ type: P.union('idle', 'speechrecognition') }, { type: 'btn_circ_right' }], ([_]) => {
            console.log('Start eye tracking')
            // Change color of lightstrip to indicate eye tracking
            showColor(Colors.FACE_TRACKING)
            // Send face tracking to frontend
            sendState(UIStates.facetracking)
            return { type: 'eytracking' }
        })
        .with([{ type: P.not('uninitialized') }, { type: 'btn_semcirc_right_up' }], ([state]) => {
            // TODO: Press Tab
            return state
        })
        .with([{ type: P.not('uninitialized') }, { type: 'btn_semcirc_right_down' }], ([state]) => {
            // TODO: Press Shift+Tab
            return state
        })
        .with([{ type: P.not('uninitialized') }, { type: 'rot_right_cw' }], ([state]) => {
            scrollDown();
            return state
        })
        .with([{ type: P.not('uninitialized') }, { type: 'rot_right_ccw' }], ([state]) => {
            scrollUp();
            return state
        })
        .with([{ type: 'eytracking' }, { type: P.union('btn_circ_right', 'btn_rect_left', 'btn_circ_left') }], ([_]) => {
            // Change color of lightstrip to indicate idle
            showColor(Colors.IDLE)
            // Send idle to frontend
            sendState(UIStates.idle)
            return { type: 'idle' }
        })
        .with([{ type: 'speechrecognition' }, { type: 'btn_circ_left' }], ([_]) => {
            // TODO: Stop speech recognition
            // Change color of lightstrip to indicate idle
            showColor(Colors.IDLE)
            // Send idle to frontend
            sendState(UIStates.idle)
            return { type: 'idle' }
        })
        .with([{ type: 'browsercontrol' }, { type: 'btn_rect_left' }], ([_]) => {
            // TODO: Stop browser control
            return { type: 'idle' }
        })
        .with([{ type: 'browsercontrol' }, { type: 'btn_circ_left' }], ([_]) => {
            // TODO: Open new Tab
            return { type: 'browsercontrol' }
        })
        .with([{ type: 'browsercontrol' }, { type: 'btn_semcirc_left' }], ([_]) => {
            // TODO: Change to previous Tab
            return { type: 'browsercontrol' }
        })
        .with([{ type: 'browsercontrol' }, { type: 'btn_semcirc_right' }], ([_]) => {
            // TODO: Change to next Tab
            return { type: 'browsercontrol' }
        })
        .with([{ type: 'browsercontrol' }, { type: 'btn_circ_right' }], ([_]) => {
            // TODO: Close Tab
            return { type: 'browsercontrol' }
        })
        .exhaustive()
}