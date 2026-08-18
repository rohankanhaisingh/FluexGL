import { v4 } from "uuid";

import { ShaderModule } from "../shaders/ShaderModule";

export class RenderPipeline {

    public readonly id: string = v4();

    public pipeline: GPURenderPipeline | null = null;
    public bindGroupLayout: GPUBindGroupLayout | null = null;
    public cameraBindGroup: GPUBindGroup | null = null;

    public build(device: GPUDevice, shader: ShaderModule, format: GPUTextureFormat): RenderPipeline {

        this.bindGroupLayout = device.createBindGroupLayout({
            label: "CameraBindGroupLayout",
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: "uniform"
                    }
                }
            ]
        });

        this.pipeline = device.createRenderPipeline({
            label: "BasicRenderPipeline",
            layout: device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayout]
            }),
            vertex: {
                module: shader.gpuShaderModule as GPUShaderModule,
                entryPoint: "vertexShaderMain",
                buffers: [
                    {
                        arrayStride: 2 * 4,
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: "float32x2"
                            }
                        ]
                    }
                ]
            },
            fragment: {
                module: shader.gpuShaderModule as GPUShaderModule,
                entryPoint: "fragmentShaderMain",
                targets: [{ format }]
            },
            primitive: {
                topology: "triangle-list"
            }
        });

        return this;
    }

    public createCameraBindGroup(device: GPUDevice, cameraBuffer: GPUBuffer): RenderPipeline {

        if (!this.bindGroupLayout)
            throw new Error("RenderPipeline has not been built yet.");

        this.cameraBindGroup = device.createBindGroup({
            label: "CameraBindGroup",
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: cameraBuffer }
                }
            ]
        });

        return this;
    }

    public bind(passEncoder: GPURenderPassEncoder): void {

        if (!this.pipeline || !this.cameraBindGroup)
            throw new Error("RenderPipeline is not ready. Call .build() and .createCameraBindGroup() first.");

        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.cameraBindGroup);
    }
}