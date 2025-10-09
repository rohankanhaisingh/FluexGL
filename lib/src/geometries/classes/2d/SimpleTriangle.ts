import { ErrorCodes } from "../../../codes";
import { Renderable } from "../../../renderer/exports";

import shader from "../../../shaders/2d/SimpleTriangle.wgsl";
import { Debug } from "../../../utilities/exports";

export class SimpleTriangle extends Renderable {

    declare private pipeline: GPURenderPipeline;
    declare private vertexBuffer: GPUBuffer;

    public override async Initialize(device: GPUDevice, format: GPUTextureFormat, sampleCount: number): Promise<void> {
        this.shader = shader;

        const msaa = Math.max(1, sampleCount | 0);

        const module = device.createShaderModule({ code: shader, label: "SimpleTriangle.wgsl" });

        await device.pushErrorScope("validation");

        this.pipeline = device.createRenderPipeline({
            label: "SimpleTriangle-Pipeline",
            layout: "auto",
            vertex: {
                module,
                entryPoint: "vertexShaderMain",
                buffers: [{
                    arrayStride: 8,
                    attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
                }],
            },
            fragment: {
                module,
                entryPoint: "fragmentShaderMain",
                targets: [{ format }],
            },
            primitive: { topology: "triangle-list", cullMode: "none", frontFace: "ccw" },
            depthStencil: {
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less",
            },
            multisample: { count: msaa },
        });
        const err = await device.popErrorScope();
        if (err) {
            console.error("[SimpleTriangle] Pipeline validation error:", err);
            throw err;
        }

        const vertices = new Float32Array([
            0.0, 0.7,
            -0.7, -0.7,
            0.7, -0.7,
        ]);

        this.vertexBuffer = device.createBuffer({
            label: "SimpleTriangle-VertexBuffer",
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(this.vertexBuffer, 0, vertices as GPUAllowSharedBufferSource);
    }

    public override Render(pass: GPURenderPassEncoder): void {

        pass.setPipeline(this.pipeline);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.draw(3, 1, 0, 0);
    }

    public override Dispose(): void {

        if (!this.vertexBuffer) return Debug.Error("Could not destroy vertex buffer because it is undefined", [
            `Renderable ID ${this.id}`
        ], ErrorCodes.RENDERABLE_VERTEX_BUFFER_UNDEFINED);

        this.vertexBuffer.destroy();
    }
}