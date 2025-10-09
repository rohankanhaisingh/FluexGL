import { v4 } from "uuid";
import { WgslReflect } from "wgsl_reflect";

export abstract class Renderable {

    public isRenderable: boolean = true;
    public id: string = v4();
    public shader: string = "";

    public abstract Initialize(device: GPUDevice, format: GPUTextureFormat, sampleCount: number): void;
    public abstract Render(pass: GPURenderPassEncoder, viewProjectionMatrix: Float32Array): void;
    public abstract Dispose(): void;
}