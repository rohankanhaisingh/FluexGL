import { v4 } from "uuid";

export class Geometry {

    public readonly id: string = v4();
    public vertexBuffer: GPUBuffer | null = null;

    constructor(public vertexData: Float32Array, public vertexCount: number) { }

    public upload(device: GPUDevice): Geometry {

        this.vertexBuffer = device.createBuffer({
            label: "GeometryVertexBuffer",
            size: this.vertexData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertexData);
        this.vertexBuffer.unmap();

        return this;
    }
}