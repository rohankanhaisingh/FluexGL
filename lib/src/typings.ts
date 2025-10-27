export interface FluexGlDebuggerOptions {
    showInfo: boolean;
    showWarnings: boolean;
    showErrors: boolean;
    breakOnError: boolean;
}

export interface FluexGLOptions {
    debugger: FluexGlDebuggerOptions;
}

export interface FluexGlDescriptor {
    name: string;
    author: string;
    version: string;
    license: string;
    repository: string;
    options: FluexGLOptions;
}

export interface Vec2 {
    x: number;
    y: number;   
}

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface Vec4 {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface ColorfulObject {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export interface Direction {
    angle: number;
    cos: number;
    sin: number;
    normalize: () => Vec2;
    complete: () => Vec2;
    multiply: (len: number) => Vec2;
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
    "stop":  () => void;
    "idle": () => void;
}

export type ThreadEvents = {
    [K in keyof ThreadEventMap]: Array<ThreadEventMap[K]>;
}

export interface WebGPURendererOptions {
    canvasWidth: number;
    canvasHeight: number;
    antialiasing: boolean;
    powerPreference: GPUPowerPreference;
    alphaMode: GPUCanvasAlphaMode;
    format: GPUTextureFormat;
    usage: GPUTextureUsageFlags;
    requiredFeatures: GPUFeatureName[];
    requiredLimits: Record<string, number>;
    colorSpace: PredefinedColorSpace;
    msaaSampleCount: number;
    depthFormat: GPUTextureFormat;
    clearColor: GPUColor;
    devicePixelRatio: number;
}

export interface WebGPURendererFrameInfo {
    encoder: GPUCommandEncoder;
    pass: GPURenderPassEncoder;
    colorView: GPUTextureView;
}

export interface WebGPUEnsureState {
    ok: boolean;
    reason?: string;
    error?: Error;
}