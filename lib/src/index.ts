
/**
 * FluexGL brought to you by Rohan Kanhaisingh 
 * as part of the Fluex company.
 * 
 * An light-weight, modular, advanced graphics 
 * library made for shining on the web.
 * 
 * For more info, see https://www.fluex.org/solutions/fluex-gl
 */

export { WebGPURenderer2D, type WebGPURenderer2DOptions, type WebGPURendererFrame } from "./core/classes/renderer/WebGPURenderer2D";
export { Canvas, type CanvasOptions, type CanvasEventMap } from "./core/classes/renderer/Canvas";
export { RenderPipeline } from "./core/classes/renderer/RenderPipeline";

export { ShaderModule, type ShaderModuleOptions } from "./core/classes/shaders/ShaderModule";
export { BasicSprite } from "./core/classes/shaders/BasicSprite.wgsl";

export { Geometry } from "./core/classes/geometries/Geometry";
export { QuadGeometry } from "./core/classes/geometries/QuadGeometry";

export { Camera2D } from "./core/classes/cameras/Camera2D";

export { Vec2 } from "./core/classes/math/Vector2";

export { 
    type Vector2,
    type MouseButton,
    type MouseButtonMap,
    type Mouse
} from "./typings";