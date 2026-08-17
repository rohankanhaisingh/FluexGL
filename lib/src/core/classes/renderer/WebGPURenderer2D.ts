import { v4 } from "uuid";
import { yellow, green } from "ansicolor";

import { Canvas } from "./Canvas";
import { Camera2D } from "../cameras/Camera2D";

export interface WebGPURenderer2DOptions {
    clearColor?: GPUColorDict;
    antialias?: boolean;
}

export interface WebGPURendererFrame {
    commandEncoder: GPUCommandEncoder;
    passEncoder: GPURenderPassEncoder;
}

export class WebGPURenderer2D {

    public id: string = v4();

    public canvas: Canvas | null = null;
    public clearColor: GPUColorDict | null = null;

    private adapter: GPUAdapter | null = null;
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    private presentationFormat: GPUTextureFormat = "bgra8unorm";
    private cameraBuffer: GPUBuffer | null = null;

    private initialized: boolean = false;

    constructor(canvas: Canvas, options: WebGPURenderer2DOptions = {}) {
        this.canvas = canvas;
        this.clearColor = options.clearColor || { r: 0, g: 0, b: 0, a: 1 };
    }

    private assertInitialized(): void {
        if (!this.initialized)
            throw new Error("WebGPURenderer2D has not been initialized.");
    }

    public async initialize(adapterRequestOptions?: GPURequestAdapterOptions): Promise<WebGPURenderer2D> {
        console.log(yellow("Attempting to initialize WebGPURenderer2D."));

        if (!navigator.gpu)
            throw new Error("WebGPU is not supported within this browser.");

        this.adapter = await navigator.gpu.requestAdapter(adapterRequestOptions);

        if (!this.adapter)
            throw new Error("Could not request GPU adapter.");

        this.device = await this.adapter.requestDevice();

        if (!this.canvas || !this.canvas.htmlCanvasElement)
            throw new Error("The Canvas instance or its canvas HTML element has not been found.");

        this.context = this.canvas.htmlCanvasElement.getContext("webgpu");

        if (!this.context)
            throw new Error("Could not initialize WebGPU context.");

        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();

        this.context.configure({
            device: this.device,
            format: this.presentationFormat,
            alphaMode: "premultiplied",
        });

        // Camera uniform buffer: 4x4 Float32 matrix = 16 * 4 bytes
        this.cameraBuffer = this.device.createBuffer({
            label: "camera_uniform_buffer",
            size: 16 * 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.initialized = true;
        console.log(green("WebGPURenderer2D has successfully initialized."));
        return this;
    }

    public beginFrame(): WebGPURendererFrame {

        this.assertInitialized();

        const commandEncoder: GPUCommandEncoder = this.device!.createCommandEncoder();
        const textureView: GPUTextureView = this.context!.getCurrentTexture().createView();

        const passEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: this.clearColor!,
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        });

        return { commandEncoder, passEncoder };
    }

    public endFrame(commandEncoder: GPUCommandEncoder, passEncoder: GPURenderPassEncoder): WebGPURenderer2D {

        this.assertInitialized();

        passEncoder.end();
        this.device!.queue.submit([commandEncoder.finish()]);
        return this;
    }

    public uploadCamera(camera: Camera2D): WebGPURenderer2D {

        this.assertInitialized();

        const matrix = camera.update(this.canvas!.width, this.canvas!.height);
        const data = Float32Array.from(matrix);

        this.device!.queue.writeBuffer(
            this.cameraBuffer!,
            0,
            data.buffer,
            data.byteOffset,
            data.byteLength
        );

        return this;
    }

    public setClearColor(r: number, g: number, b: number, a: number = 1): WebGPURenderer2D {
        this.clearColor = { r, g, b, a };
        return this;
    }

    public resize(): WebGPURenderer2D {

        this.assertInitialized();

        this.context!.configure({
            device: this.device!,
            format: this.presentationFormat,
            alphaMode: "premultiplied",
        });

        return this;
    }

    public get isInitialized(): boolean {
        return this.initialized;
    }

    public get gpuDevice(): GPUDevice {
        this.assertInitialized();
        return this.device!;
    }

    public get gpuFormat(): GPUTextureFormat {
        return this.presentationFormat;
    }

    public get gpuCameraBuffer(): GPUBuffer {
        this.assertInitialized();
        return this.cameraBuffer!;
    }
}