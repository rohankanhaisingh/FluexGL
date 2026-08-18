import { v4 } from "uuid";

export interface ShaderModuleOptions {
    label?: string;
    code?: string;
}

export class ShaderModule {

    public readonly id: string = v4();

    protected label: string = "UnnamedShader";
    protected code: string | null = null;

    public gpuShaderModule: GPUShaderModule | null = null;

    constructor({ label, code }: ShaderModuleOptions = {}) {
        this.label = label ?? this.label;
        this.code = code ?? this.code;
    }

    public compile(device: GPUDevice): ShaderModule {

        if (!this.code)
            throw new Error("Could not compile shader module since the code content null.");

        this.gpuShaderModule = device.createShaderModule({
            label: this.label,
            code: this.code
        });

        return this;
    }

}