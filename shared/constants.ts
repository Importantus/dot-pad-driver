export enum Colors {
    BROWSER_CONTROL = '#ff0000',
    FACE_TRACKING = '#00ff00',
    SPEECH_RECOGNITION = '#0000ff',
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