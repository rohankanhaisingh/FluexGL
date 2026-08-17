import { v4 } from "uuid";
import { Canvas } from "./Canvas";

export class WebGPURenderer2D {

    public id: string = v4();

    public canvas: Canvas | null = null;
    public clearColor: GPUColorDict | null = null;

    private adapter: GPUAdapter | null = null;
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    private presentationFormat: GPUTextureFormat = "bgra8unorm";

    private initialized: boolean = false;

    

}