export enum Colors {
    BROWSER_CONTROL = '#f1c40f',
    FACE_TRACKING = '#800080',
    SPEECH_RECOGNITION = '#32cd32',
    IDLE = '#ffffff',
    BLACK = '#000000',
    GREY = '#808080'
}

export type UIState = {
    id: string,
    title: string,
    color: string
}

export const UIStates: { [key: string]: UIState } = {
    'uninitialized': {
        id: 'uninitialized',
        title: 'Uninitialized',
        color: Colors.GREY
    },
    'idle': {
        id: 'idle',
        title: 'Idle',
        color: Colors.IDLE
    },
    'browsercontrol': {
        id: 'browsercontrol',
        title: 'Browser Control',
        color: Colors.BROWSER_CONTROL
    },
    'speechrecognition': {
        id: 'speechrecognition',
        title: 'Speech Recognition',
        color: Colors.SPEECH_RECOGNITION
    },
    'facetracking': {
        id: 'facetracking',
        title: 'Face Tracking',
        color: Colors.FACE_TRACKING
    }
}