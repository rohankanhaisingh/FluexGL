import { v4 } from "uuid";

import { ErrorCodes, WarningCodes } from "../../codes";
import { WebGPURendererOptions } from "../../typings";
import { Debug } from "../../utilities/exports";

export class WebGPURenderer {

    private width: number = 0;
    private height: number = 0;
    private devicePixelRatio: number = window.devicePixelRatio || 1;

    declare private msaaTexture: GPUTexture;
    declare private depthTexture: GPUTexture;
    declare private msaaTextureView: GPUTextureView;
    declare private depthTextureView: GPUTextureView;

    public id: string = v4();

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

        this.SetDevicePixelRatio(this.options.devicePixelRatio ?? (window.devicePixelRatio || 1));

        return this;
    }

    private applySizeChanges() {

        const width = this.options.canvasWidth ?? this.canvas.clientWidth ?? 800;
        const height = this.options.canvasHeight ?? this.canvas.clientHeight ?? 600;

        this.SetSize(width, height);
    }

    private createOrResizeTargets() {

        this.depthTexture && this.depthTexture.destroy();
        this.msaaTexture && this.msaaTexture.destroy();

        if(!this.gpuDevice) return;

        this.depthTexture = this.gpuDevice.createTexture({
            size: {
                width: this.width,
                height: this.height,
            },
            format: this.options.depthFormat ?? "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: "FluexGL-WebGPURenderer-DepthTexture-" + this.id
        });

        this.depthTextureView = this.depthTexture.createView();

        const msaaSampleCount: number = this.options.msaaSampleCount ?? 4;

        if (msaaSampleCount < 1) return;

        this.msaaTexture = this.gpuDevice.createTexture({
            size: {
                width: this.width,
                height: this.height,
            },
            format: this.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: msaaSampleCount,
            label: "FluexGL-WebGPURenderer-MSAATexture-" + this.id
        });
    }
}