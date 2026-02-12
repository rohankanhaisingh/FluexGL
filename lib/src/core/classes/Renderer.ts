import { v4 } from "uuid";

import { RendererOptions } from "../../typings";

export class Renderer {

    public readonly id: string = v4();
    public readonly userAgent: string = navigator.userAgent;

    public width: number = 600;
    public height: number = 450;
    public anchoredElement: HTMLElement | null = null;

    protected adapter: GPUAdapter | null = null;
    protected device: GPUDevice | null = null;
    protected queue: GPUQueue | null = null;
    protected format: GPUTextureFormat | null = null;
    protected context: GPUCanvasContext | null = null;

    protected depthTexture: GPUTexture | null = null;
    protected depthView: GPUTextureView | null = null;
    protected depthFormat: GPUTextureFormat = "depth24plus";
    protected depthTextureWidth: number = 0;
    protected depthTextureHeight: number = 0;

    protected basicPipeline: GPURenderPipeline | null = null
    protected triangleVertexBuffer: GPUBuffer | null = null;
    protected triangleVertexCount: number = 3;

    public hasInitialized: boolean = false;

    public constructor(protected canvas: HTMLCanvasElement, options?: RendererOptions) {

        this.width = options?.width ?? this.width;
        this.height = options?.height ?? this.height;
        this.anchoredElement = options?.anchorToElement ?? this.anchoredElement;

        canvas.width = this.width;
        canvas.height = this.height;

        canvas.setAttribute("renderer-id", this.id);
        window.addEventListener("resize", () => {
            this.windowOnResizeEvent();
        });
    }

    private windowOnResizeEvent() {

        if (this.anchoredElement) {
            const anchoredElementBoundaries: DOMRect = this.anchoredElement.getBoundingClientRect();
            this.SetSize(anchoredElementBoundaries.width, anchoredElementBoundaries.height);
        }
    }

    public async Initialize(): Promise<boolean> {

        if (!navigator.gpu)
            throw new Error("Could not initialize GPUContext, since WebGPU is not supported in this browser.");

        const adapter: GPUAdapter | null = await navigator.gpu.requestAdapter();

        if (!adapter)
            throw new Error("Could not initialize GPUContext, failed to request GPU adapter.");

        const device: GPUDevice | null = await adapter.requestDevice();

        if (!device)
            throw new Error("Could not initialized GPUContext, could not resolve GPU device.");

        const context = this.canvas.getContext("webgpu");

        if (!context)
            throw new Error("Could not initialize GPUContext, WebGPU canvas context could not be resolved.");

        const format: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();

        this.adapter = adapter;
        this.device = device;
        this.queue = device.queue;
        this.context = context;
        this.format = format;

        context.configure({ device, format, alphaMode: "opaque" });
        this.AllocateDepthTexture(this.width, this.height);
        this.CreateBasicTriangleResources();

        this.canvas.setAttribute("gpu-device", device.adapterInfo.device ?? "unknown");
        this.canvas.setAttribute("gpu-vendor", device.adapterInfo.vendor);
        this.canvas.setAttribute("gpu-architecture", device.adapterInfo.architecture);
        this.canvas.setAttribute("is-ready", "true");
        this.canvas.setAttribute("render-mode", "3-dimensional");

        this.hasInitialized = true;
        return true;
    }

    public SetSize(width?: number, height?: number): void {

        const dpr: number = window.devicePixelRatio ? window.devicePixelRatio : 1;

        this.width = width ?? this.width;
        this.height = height ?? this.height;

        this.canvas.width = Math.max(1, Math.floor(this.width * dpr));
        this.canvas.height = Math.max(1, Math.floor(this.height * dpr));

        if (this.hasInitialized && this.device && this.context && this.format) {

            this.context.configure({ device: this.device, format: this.format, alphaMode: "opaque" });
            this.AllocateDepthTexture(this.canvas.width, this.canvas.height);
        }
    }

    public AllocateDepthTexture(width: number, height: number): void {

        if (!this.device) throw new Error("Renderer device is null.");

        width = Math.max(1, Math.floor(width));
        height = Math.max(1, Math.floor(height));

        if (this.depthTexture && this.depthTextureWidth === width && this.depthTextureHeight === height) {
            return;
        }

        if (this.depthTexture) {
            this.depthTexture.destroy();
            this.depthTexture = null;
            this.depthView = null;
        }

        this.depthTexture = this.device.createTexture({
            size: { width: width, height: height, depthOrArrayLayers: 1 },
            format: this.depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        this.depthView = this.depthTexture.createView();
        this.depthTextureWidth = width;
        this.depthTextureHeight = height;
    }

    public CreateBasicTriangleResources(): void {

        if (!this.device || !this.format) return;

        const shaderModule: GPUShaderModule = this.device.createShaderModule({
            code: `
                struct VertexShaderOutput {
                    @builtin(position) position: vec4f,
                    @location(0) color: vec3f
                };

                @vertex
                fn vertexShaderMain(
                    @location(0) positionInpit: vec2f,
                    @location(1) colorInput: vec3f
                ) -> VertexShaderOutput {
                    
                    var output: VertexShaderOutput;
                    output.position = vec4f(positionInpit, 0.0, 1.0);
                    output.color = colorInput;

                    return output;
                }

                @fragment
                fn fragmentShaderMain(
                    @location(0) color: vec3f
                ) -> @location(0) vec4f {
                    return vec4f(color, 1.0);
                }
            `
        });

        this.basicPipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: shaderModule,
                entryPoint: "vertexShaderMain",
                buffers: [
                    {
                        arrayStride: 20,
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: "float32x2"
                            },
                            {
                                shaderLocation: 1,
                                offset: 8,
                                format: "float32x3"
                            }
                        ]
                    }
                ]
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fragmentShaderMain",
                targets: [
                    {
                        format: this.format
                    }
                ]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: "none"
            },
            depthStencil: {
                format: this.depthFormat,
                depthWriteEnabled: true,
                depthCompare: "less"
            }
        });

        const vertices = new Float32Array([
            0.0, 0.6, 1.0, 0.2, 0.2,
            -0.6, -0.6, 0.2, 1.0, 0.2,
            0.6, -0.6, 0.2, 0.2, 1.0,
        ]);

        this.triangleVertexBuffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        new Float32Array(this.triangleVertexBuffer.getMappedRange()).set(vertices);
        this.triangleVertexBuffer.unmap();
    }

    public Render(): void {

        if (!this.device || !this.queue || !this.context)
            throw new Error("Could not render frame: either device, queue or context is null.");

        const dpr: number = window.devicePixelRatio ? window.devicePixelRatio : 1,
            targetWidth: number = Math.max(1, Math.floor(this.canvas.clientWidth * dpr)),
            targetHeight: number = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));

        if (this.width !== targetWidth || this.height !== targetHeight) {
            this.SetSize(targetWidth, targetHeight);

            if (this.format) {
                this.context.configure({ device: this.device, format: this.format, alphaMode: "opaque" });
            }
        }

        this.AllocateDepthTexture(this.width, this.height);

        const encoder: GPUCommandEncoder = this.device.createCommandEncoder(),
            colorView: GPUTexture = this.context.getCurrentTexture();

        const pass: GPURenderPassEncoder = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: colorView,
                    clearValue: {
                        r: 0.46,
                        g: 0.06,
                        b: 0.08,
                        a: 1
                    },
                    loadOp: "clear",
                    storeOp: "store"
                }
            ],
            depthStencilAttachment: this.depthView
                ? {
                    view: this.depthView,
                    depthClearValue: 1,
                    depthLoadOp: "clear",
                    depthStoreOp: "store"
                } : undefined,
            maxDrawCount: undefined
        });

        if (!this.basicPipeline || !this.triangleVertexBuffer) {

        } else {
            pass.setPipeline(this.basicPipeline);
            pass.setVertexBuffer(0, this.triangleVertexBuffer);
            pass.draw(this.triangleVertexCount, 1, 0, 0);
        }

        pass.end();

        const commandBuffer: GPUCommandBuffer = encoder.finish();
        this.queue.submit([commandBuffer]);
    }
}