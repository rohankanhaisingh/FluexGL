export interface RendererOptions {
    width?: number;
    height?: number;
    anchorToElement?: HTMLElement;
}

export interface ThreadOnLoopEvent {
    now: number;
    deltaTime: number;
    frameRate: number;
    lastRegisteredTimestamp: number;
    simulationUpdateRate: number;
}

export interface ThreadEventMap {
    "update": (event: ThreadOnLoopEvent) => void;
    "start": () => void;
    "stop": () => void;
    "idle": () => void;
}

export type ThreadEvents = {
    [K in keyof ThreadEventMap]: Array<ThreadEventMap[K]>;
}
