import { match, P } from 'ts-pattern';
import { leftClick, rightClick } from './mouseControl/mouseClick';
import { showBootupAnimation, showColor, showShutdownAnimation } from './board/strip';
import { Colors } from './constants';
import { startFaceTracking, stopFaceTracking } from './mouseControl/faceMove';
import { sendReady } from './renderer/mainToRenderer';

type ControllerState =
    | { type: 'uninitialized' }
    | { type: 'idle' }
    | { type: 'browsercontrol' }
    | { type: 'eytracking' }
    | { type: 'speechrecognition' }

export type ControllerAction =
    | { type: 'bootup' }
    | { type: 'shutdown' }
    | { type: 'btn_rect_left' }
    | { type: 'btn_circ_left' }
    | { type: 'btn_semcirc_left' }
    | { type: 'btn_semcirc_right' }
    | { type: 'btn_circ_right' }
    | { type: 'btn_semcirc_right_up' }
    | { type: 'btn_semcirc_right_down' }


let state: ControllerState = { type: 'uninitialized' }

export function dispatch(action: ControllerAction) {
    state = stateReducer(state, action)
}

function stateReducer(state: ControllerState, action: ControllerAction): ControllerState {
    return match<[ControllerState, ControllerAction], ControllerState>([state, action])
        .with([{ type: 'uninitialized' }, { type: 'bootup' }], ([_]) => {
            // Show bootup animation on lightstrip
            showBootupAnimation();
            // Send ready to backend
            sendReady()
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
            // TODO: Change color of UI to indicate browser control
            return { type: 'browsercontrol' }
        })
        .with([{ type: P.union('idle', 'eytracking') }, { type: 'btn_circ_left' }], ([_]) => {
            // TODO: Start speech recognition
            // TODO: Change color of lightstrip to indicate speech recognition
            // TODO: Change color of UI to indicate speech recognition
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
            // Activate eye tracking
            startFaceTracking()
            // Change color of lightstrip to indicate eye tracking
            showColor(Colors.FACE_TRACKING)
            // TODO: Change color of UI to indicate eye tracking
            return { type: 'eytracking' }
        })
        .with([{ type: P.not('uninitialized') }, { type: 'btn_semcirc_right_up' }], ([_]) => {
            // TODO: Press Tab
            return { type: 'idle' }
        })
        .with([{ type: P.not('uninitialized') }, { type: 'btn_semcirc_right_down' }], ([_]) => {
            // TODO: Press Shift+Tab
            return { type: 'idle' }
        })
        .with([{ type: 'eytracking' }, { type: P.union('btn_circ_right', 'btn_rect_left', 'btn_circ_left') }], ([_]) => {
            // Stop eye tracking
            stopFaceTracking()
            // Change color of lightstrip to indicate idle
            showColor(Colors.IDLE)
            // TODO: Change color of UI to indicate idle
            return { type: 'idle' }
        })
        .with([{ type: 'speechrecognition' }, { type: 'btn_circ_left' }], ([_]) => {
            // TODO: Stop speech recognition
            // Change color of lightstrip to indicate idle
            showColor(Colors.IDLE)
            // TODO: Change color of UI to indicate idle
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