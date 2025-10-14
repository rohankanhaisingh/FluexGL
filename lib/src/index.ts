/**
 * FluexGL brought to you by Rohan Kanhaisingh 
 * as part of the Fluex company.
 * 
 * An light-weight, modular, advanced graphics 
 * library made for shining on the web.
 * 
 * For more info, see https://www.fluex.org/solutions/fluex-gl
 */

import { FluexGlDescriptor } from "./typings";

export const FluexGL: FluexGlDescriptor = {
    name: "FluexGL",
    author: "Rohan Kanhaisingh",
    version: "0.0.1",
    license: "MIT",
    repository: "https://www.github.com/rohankanhaisingh/FluexGL",
    options: {
        debugger: {
            showInfo: true,
            showWarnings: true,
            showErrors: true,
            breakOnError: false,
        }
    }
}

export {
    CalculateAverageArrayValue,
    CalculateDirection,
    CalculateIntersection,
    CalculateVectorAngle,
    CalculateVectorDistance,
    RandomBoolean,
    RandomFloatInRange,
    RandomIntegerInRange,
    RandomItem,
    RandomNormal,
    RandomUnitVector2D,
    RandomUnitVector3D,
    ConvertHexToByteArray,
    ConvertByteArrayToHex,
    RGBToHSL,
    HexToRGB,
    RGBToHex,
    HSLToRGB,
    PixelsPerMeter,
    DegreesToRadians,
    RadiansToDegrees,
    Epsilon,
    InfinityValue,
    PI,
    TwoPI,
    HalfPI,
    QuarterPI, MinInt32,
    MaxInt32,
    MinSafeInt,
    MaxSafeInt,
    DefaultGravity,
    DefaultAirDensity,
    Debug, Vector2, Vector3, Vector4, Color
} from "./utilities/exports";

export {
    SimpleTriangle,
    CubeGeometry
} from "./geometries/exports";

export {
    WebGPURenderer,
    Renderable
} from "./renderer/exports";

export {
    Camera,
    PerspectiveCamera
} from "./camera/exports"; 

export {
    WebGPURendererScene, Thread
} from "./others/exports";

// Exporting typings.
export {
    Vec2, Vec3, Vec4,
    ColorfulObject,
    Direction,
    ThreadOnLoopEvent,
    ThreadEventMap,
    ThreadEvents,
    FluexGlDescriptor,
    FluexGLOptions,
    FluexGlDebuggerOptions
} from "./typings";