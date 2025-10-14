import { v4 } from "uuid";

import { ErrorCodes, WarningCodes } from "../../codes";
import { WebGPURendererFrameInfo, WebGPURendererOptions } from "../../typings";
import { Debug } from "../../utilities/exports";
import { WebGPURendererScene } from "../../others/exports";
import { Camera } from "../../camera/exports";
import { Renderable } from "./Renderable";

export class WebGPURenderer {

    private width: number = 0;
    private height: number = 0;
    private devicePixelRatio: number = window.devicePixelRatio || 1;

    declare private msaaTexture: GPUTexture;
    declare private depthTexture: GPUTexture;
    declare private msaaTextureView: GPUTextureView;
    declare private depthTextureView: GPUTextureView;

    public id: string = v4();
    public hasInitialized: boolean = false;

    declare public gpuDevice: GPUDevice;
    declare public gpuAdapter: GPUAdapter;

    declare public context: GPUCanvasContext;
    declare public format: GPUTextureFormat;
    declare public queue: GPUQueue;

    declare public canvas: HTMLCanvasElement;

    constructor(public options: Partial<WebGPURendererOptions> = {}) {

        this.canvas = document.createElement("canvas");

        this.canvas.width = options.canvasWidth ?? 800;
        this.canvas.height = options.canvasHeight ?? 600;

        this.canvas.setAttribute("fluexgl-renderer-type", "WebGPURenderer");
        this.canvas.setAttribute("fluexgl-renderer-id", this.id);
    }

    // Public methods.

    public SetCanvasSizeRelativeToWindow(margin: number = 0, updateOnResize: boolean = false): void {

        if (!this.canvas) return Debug.Error("WebGPURenderer: Cannot set canvas size because canvas is not created.", [
            "Make sure that the WebGPURenderer instance is created properly."
        ], ErrorCodes.WGPUR_CANVAS_NOT_CREATED);

        const self = this;

        this.SetSize(window.innerWidth - margin, window.innerHeight - margin);

        updateOnResize && window.addEventListener("resize", function () {

            self.SetSize(window.innerWidth - margin, window.innerHeight - margin);
        });
    }

    public AppendCanvasToElement(element: HTMLElement): void {

        if (!this.canvas) return Debug.Error("WebGPURenderer: Cannot append canvas to element because canvas is not created.", [
            "Make sure that the WebGPURenderer instance is created properly."
        ], ErrorCodes.WGPUR_CANVAS_NOT_CREATED);

        element.appendChild(this.canvas);
    }

    public SetDevicePixelRatio(ratio: number = 1) {

        if (ratio >= 2) Debug.Warn("WebGPURenderer: Setting display pixel ratio to 2 or higher may cause performance issues on some devices.", [
            "Make sure that the device running FluexGL can handle high pixel ratios.",
            "Consider using a ratio between 1 and 2 for better performance."
        ], WarningCodes.WGPUR_HIGH_DPR_VALUE);

        if (ratio >= 10) Debug.Warn("Bruh this gpu gonna die bro 🥀", [
            "Setting display pixel ratio to 10 or higher is not recommended.",
            "This may cause severe performance issues or even crash the application.",
        ], WarningCodes.WGPUR_HIGH_DPR_VALUE);

        if (ratio <= 0) {

            Debug.Error("WebGPURenderer: Display pixel ratio must be greater than 0. Display pixel ratio will be set to 1.", [
                "Provided value: " + ratio
            ], ErrorCodes.WGPUR_INVALID_DPR_VALUE);

            this.devicePixelRatio = window.devicePixelRatio || 1;

            return null;
        }

        this.devicePixelRatio = Math.max(1, Math.min(ratio || 1, 100));
        this.applySizeChanges();

        return this;
    }

    public SetSize(width: number = 0, height: number = 0) {

        this.canvas.width = Math.max(1, Math.floor(width * this.devicePixelRatio));
        this.canvas.height = Math.max(1, Math.floor(height * this.devicePixelRatio));

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.createOrResizeTargets();

        return this;
    }

    public async Initialize(): Promise<WebGPURenderer | null> {

        if (!navigator.gpu) {

            Debug.Error("WebGPURenderer: WebGPU is not supported in this browser.", [
                "Make sure that you are using a compatible browser.",
                "Check https://caniuse.com/webgpu for more information."
            ], ErrorCodes.WGPUR_API_NOT_SUPPORTED);
            return null;
        }

        Debug.Log("WebGPURenderer: Attempting to request GPU adapter.", [
            "Options: " + JSON.stringify(this.options)
        ]);

        const gpuAdapter: GPUAdapter | null = await navigator.gpu.requestAdapter({
            powerPreference: this.options.powerPreference ?? "high-performance"
        });

        if (!gpuAdapter) {

            Debug.Error("WebGPURenderer: Unable to get GPU Adapter.", [
                "Make sure that your system has a compatible GPU and that WebGPU is enabled in your browser."
            ], ErrorCodes.WGPUR_UNABLE_TO_GET_ADAPTER);
            return null;
        }

        Debug.Log("WebGPURenderer: Successfully obtained GPU adapter.", [
            "Architecture: " + (gpuAdapter.info.architecture ?? "Unknown"),
            "Device: " + (gpuAdapter.info.device ?? "Unknown"),
            "Vendor: " + (gpuAdapter.info.vendor ?? "Unknown"),
            "Renderer ID: " + this.id
        ]);

        this.gpuAdapter = gpuAdapter;

        const device: GPUDevice = await this.gpuAdapter.requestDevice({
            requiredFeatures: this.options.requiredFeatures ?? [],
            requiredLimits: this.options.requiredLimits ?? {},
            label: "FluexGL-WebGPURenderer-Device-" + this.id
        });

        device.addEventListener("uncapturederror", function (event: GPUUncapturedErrorEvent) {
            return Debug.Error("WebGPURenderer: An uncaught GPU error occurred.", [
                "Error: " + event.error.message
            ], ErrorCodes.WGPUR_DEVICE_UNCAPTURED_ERROR);
        });

        device.lost.then(function (info: GPUDeviceLostInfo) {
            return Debug.Error("WebGPURenderer: The GPU device was lost.", [
                "Reason: " + info.message
            ], ErrorCodes.WGPUR_DEVICE_LOST_ERROR);
        });

        this.gpuDevice = device;

        this.context = this.canvas.getContext("webgpu") as unknown as GPUCanvasContext;
        this.format = this.options.format ?? navigator.gpu.getPreferredCanvasFormat();

        this.configureContext();
        this.SetDevicePixelRatio(this.options.devicePixelRatio ?? (window.devicePixelRatio || 1));
        this.applySizeChanges();

        this.hasInitialized = true;

        return this;
    }

    public BeginFrame(): WebGPURendererFrameInfo {

        const clear = this.options.clearColor ?? { r: 0, g: 0, b: 0, a: 1 };
        const currentTextureView = this.context.getCurrentTexture().createView();
        const encoder = this.gpuDevice.createCommandEncoder({
            label: "FluexGL-WebGPURenderer-CommandEncoder-" + this.id,
        });

        const msaa = Math.max(1, this.options.msaaSampleCount ?? 1);

        let colorAttachment: GPURenderPassColorAttachment;

        if (!this.depthTextureView) {
            this.createOrResizeTargets();
        }

        if (msaa > 1) {
            if (!this.msaaTextureView) {
                this.createOrResizeTargets();
            }
            colorAttachment = {
                view: this.msaaTextureView,
                resolveTarget: currentTextureView,
                loadOp: "clear",
                storeOp: "store",
                clearValue: clear,
            };
        } else {
            colorAttachment = {
                view: currentTextureView,
                loadOp: "clear",
                storeOp: "store",
                clearValue: clear,
            } as GPURenderPassColorAttachment;
        }

        const pass = encoder.beginRenderPass({
            label: "FluexGL-WebGPURenderer-RenderPass-" + this.id,
            colorAttachments: [colorAttachment],
            depthStencilAttachment: {
                view: this.depthTextureView,
                depthLoadOp: "clear",
                depthStoreOp: "store",
                depthClearValue: 1.0,
            },
        });

        return { encoder, pass, colorView: currentTextureView };
    }


    public EndFrame(frameInfo: WebGPURendererFrameInfo): void {

        frameInfo.pass.end();
        this.gpuDevice.queue.submit([frameInfo.encoder.finish()]);
    }

    public Dispose(): void {
        this.depthTexture && this.depthTexture.destroy();
        this.msaaTexture && this.msaaTexture.destroy();
    }

    public Render(scene: WebGPURendererScene, camera: Camera) {

        if (!scene.hasPrepared) return Debug.Error("Could not render because the renderable objects in the scene has not been prepared.", [
            "Make sure to call 'await <WebGPURendererScene>.Prepare()' before calling this method."
        ], ErrorCodes.WGPUR_SCENE_NOT_PREPARED);

        if (!this.gpuDevice.queue) return;

        camera.WriteUniformsToQueue(this.gpuDevice.queue);

        const frame: WebGPURendererFrameInfo = this.BeginFrame();

        frame.pass.setBindGroup(0, camera.bindGroup);

        for (let i = 0; i < scene.rendererables.length; i++) {

            const renderable: Renderable = scene.rendererables[i];

            const cameraViewProjectionCast = camera.viewProjection as unknown as Float32Array;

            renderable.Render(frame.pass, cameraViewProjectionCast);
        }

        this.EndFrame(frame);
    }

    // Private methods.

    private applySizeChanges() {

        const width = this.options.canvasWidth ?? this.canvas.clientWidth ?? 800;
        const height = this.options.canvasHeight ?? this.canvas.clientHeight ?? 600;

        this.SetSize(width, height);
    }

    private createOrResizeTargets() {
        this.depthTexture?.destroy();
        this.msaaTexture?.destroy();
        if (!this.gpuDevice) return;

        const width = Math.max(1, this.width | 0);
        const height = Math.max(1, this.height | 0);
        const msaa = this.getMsaa();

        this.depthTexture = this.gpuDevice.createTexture({
            size: { width, height },
            format: "depth24plus",
            sampleCount: msaa,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: `FluexGL-WebGPURenderer-DepthTexture-${this.id}`,
        });
        this.depthTextureView = this.depthTexture.createView();

        if (msaa > 1) {

            this.msaaTexture = this.gpuDevice.createTexture({
                size: { width, height },
                format: this.format,
                sampleCount: msaa,
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
                label: `FluexGL-WebGPURenderer-MSAATexture-${this.id}`,
            });
            this.msaaTextureView = this.msaaTexture.createView();
        } else {

            this.msaaTexture = undefined as any;
            this.msaaTextureView = undefined as any;
        }
    }
    private configureContext(): void {

        if (!this.gpuDevice) return Debug.Error("WebGPURenderer: Cannot configure context because GPU device is undefined.", [
            "At configuring context."
        ], ErrorCodes.WGPUR_DEVICE_UNDEFINED);

        const configuration: GPUCanvasConfiguration = {
            device: this.gpuDevice,
            format: this.format,
            alphaMode: this.options.alphaMode ?? "premultiplied",
            colorSpace: this.options.colorSpace ?? "srgb",
        }

        if (!this.context) return Debug.Error("WebGPURenderer: Cannot configure context because GPU canvas context is undefined.", [
            "At configuring context."
        ], ErrorCodes.WGPUR_CONTEXT_UNDEFINED);

        this.context.configure(configuration);

        return Debug.Log("WebGPURenderer: Successfully configured GPU canvas context.", [
            "Configuration: " + JSON.stringify(configuration)
        ]);
    }

    private getMsaa(): number {
        const n = this.options.msaaSampleCount ?? 1;

        return (n === 1 || n === 2 || n === 4 || n === 8) ? n : 1;
    }
}