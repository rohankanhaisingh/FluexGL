import { Renderable } from "../../renderer/exports";

import shader from "../../shaders/3d/CubeGeometryShader.wgsl";

import CubeGeometryIndices from "../../indices/3d/CubeGeometryIndices";
import CubeGeometryVertices from "../../vertices/3d/CubeGeometryVertices";

const align4 = (n: number) => (n + 3) & ~3;

export class CubeGeometry extends Renderable {

    // Main geometry render pipeline.
    declare private pipeline: GPURenderPipeline;

    // GPU buffers.
    declare private vertexBuffer: GPUBuffer;
    declare private indexBuffer: GPUBuffer;
    declare private uniformBuffer: GPUBuffer;

    // Bind group.
    declare private bindGroup: GPUBindGroup;

    private positionStride: number = 3;
    private colorStride: number = 3;

    private vertices: Float32Array = new Float32Array(CubeGeometryVertices());
    private indices: Uint16Array = new Uint16Array(CubeGeometryIndices());

    private indexCount: number = this.indices.length;

    // Uniform buffer matrix size, represents a 4x4 matrix (16 floats).
    private uniformBufferMatrixSize: number = (4 * 4) * 4;

    public override Initialize(device: GPUDevice, format: GPUTextureFormat, sampleCount: number): void {
        
        this.shader = shader;
        
        const module: GPUShaderModule = device.createShaderModule({code: shader});
        
        this.pipeline = device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module,
                entryPoint: "vertexShaderMain",
                buffers: [
                    {
                        arrayStride: (this.positionStride + this.colorStride) * 4,
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: "float32x3"
                            },
                            {
                                shaderLocation: 1,
                                offset: 12,
                                format: "float32x3"
                            }
                        ]
                    }
                ]
            },
            fragment: {
                module,
                entryPoint: "fragmentShaderMain",
                targets: [{format}]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "back",
            },
            depthStencil: {
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less"
            },
            multisample: {
                count: sampleCount
            }
        });

        this.vertexBuffer = device.createBuffer({
            size: this.vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });

        this.indexBuffer = device.createBuffer({
            size: align4(this.indices.byteLength),
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        })

        device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices as GPUAllowSharedBufferSource);
        device.queue.writeBuffer(this.indexBuffer, 0, this.indices as GPUAllowSharedBufferSource);

        this.uniformBuffer = device.createBuffer({
            size: this.uniformBufferMatrixSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.bindGroup = device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer
                    }
                }
            ]
        })
    }

    public UpdateUniforms(device: GPUDevice, mvp: Float32Array): void {
        device.queue.writeBuffer(this.uniformBuffer, 0, mvp as GPUAllowSharedBufferSource);
    }

    public override Render(pass: GPURenderPassEncoder, viewProjectionMatrix: Float32Array): void {
        
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.setIndexBuffer(this.indexBuffer, "uint16");
        pass.drawIndexed(this.indexCount, 1, 0, 0, 0);
    }

    public override Dispose(): void {

        this.vertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.uniformBuffer.destroy();
    }
}