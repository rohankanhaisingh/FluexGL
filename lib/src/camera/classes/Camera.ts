import { mat4, glMatrix, vec3, vec2 } from "gl-matrix";
import { v4 } from "uuid";

import { Debug, Vector3 } from "../../utilities/exports";
import { ErrorCodes } from "../../codes";

export abstract class Camera {

    public id: string = v4();

    public position: Vector3 = new Vector3(0, 0, 0);
    public target: Vector3 = new Vector3(0, 0, 0);
    public up: Vector3 = new Vector3(0, 1, 0);

    public aspect: number = 1;

    public readonly view: mat4 = mat4.create();
    public readonly projection: mat4 = mat4.create();
    public readonly viewProjection: mat4 = mat4.create();

    declare public uniformBuffer: GPUBuffer;
    declare public bindGroup: GPUBindGroup;
    declare public bindGroupLayout: GPUBindGroupLayout;

    protected abstract updateProjection(): void;

    public SetAspect(aspect: number): void {

        this.aspect = Math.max(1e-6, aspect);
        this.updateMatrices();
    }

    public SetPosition(x: number | Vector3, y?: number, z?: number): Camera {

        (x instanceof Vector3)
            ? this.position = x
            : this.position.Set(x, y ?? this.position.x, z ?? this.position.y);

        return this.updateMatrices();
    }

    public LookAt(x: number | Vector3, y?: number, z?: number): Camera {

        (x instanceof Vector3)
            ? this.target = x
            : this.target.Set(x, y ?? this.target.x, z ?? this.target.y);

        return this.updateMatrices();
    }

    public CreateUniformBuffer(device: GPUDevice): GPUBuffer {

        if (this.uniformBuffer) return this.uniformBuffer;

        this.uniformBuffer = device.createBuffer({
            size: 80,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: "CameraUniformBuffer-" + this.id
        });

        return this.uniformBuffer;
    }

    public WriteUniformsToQueue(queue: GPUQueue): Camera | void {

        if (!this.uniformBuffer) return Debug.Error("Could not write uniform buffer to queue, because the buffer is undefined.", [], ErrorCodes.CAM_UNIFORM_BUFFER_UNDEFINED);

        const viewProjectionCast = this.viewProjection as unknown as ArrayBuffer;

        const positionArrayBuffer = vec3.fromValues(this.position.x, this.position.y, this.position.z),
            positionArrayBufferCast = positionArrayBuffer as unknown as ArrayBuffer;

        queue.writeBuffer(this.uniformBuffer, 0, viewProjectionCast);
        queue.writeBuffer(this.uniformBuffer, 64, positionArrayBufferCast);

        return this;
    }

    /**
     * Note: this is an internal method and should not be used
     * outside the core of FluexGL, which is in the most use cases.
     * @param device 
     */
    public EnsureBinding(device: GPUDevice) {

        if(!this.bindGroupLayout) this.bindGroupLayout = device.createBindGroupLayout({
            label: "CameraBindGroupLayout",
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: "uniform"
                    }
                }
            ]
        });
        
        if(!this.bindGroup) {

            const uniformBuffer: GPUBuffer = this.CreateUniformBuffer(device);

            this.bindGroup = device.createBindGroup({
                label: "CameraBindGroup",
                layout: this.bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: uniformBuffer
                        }
                    }
                ]
            });
        } 

        this.updateMatrices();

        return this.bindGroupLayout;
    }

    // Private and protected class members.

    protected updateMatrices() {

        const position: vec3 = vec3.fromValues(this.position.x, this.position.y, this.position.z),
            target: vec3 = vec3.fromValues(this.target.x, this.target.y, this.target.z),
            up: vec3 = vec3.fromValues(this.up.x, this.up.y, this.up.z);

        mat4.lookAt(this.view, position, target, up);
        this.updateProjection();
        mat4.multiply(this.viewProjection, this.projection, this.view);

        return this;
    }
}