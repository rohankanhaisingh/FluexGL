import { v4 } from "uuid";

import { Renderable, WebGPURenderer } from "../../renderer/exports";
import { Debug } from "../../utilities/exports";
import { ErrorCodes } from "../../codes";
import { Camera } from "../../camera/exports";
import { WebGPURendererFrameInfo } from "../../typings";

export class WebGPURendererScene {

    public rendererables: Renderable[] = [];
    public id: string = v4();

    public hasPrepared: boolean = false;

    constructor(public renderer: WebGPURenderer) {}

    public AddRenderable(renderable: Renderable) {
        if (renderable.isRenderable) {
            this.rendererables.push(renderable);
        }
    }

    public RemoveRenderable(renderable: Renderable) {
        const index = this.rendererables.indexOf(renderable);
        if (index > -1) {
            this.rendererables.splice(index, 1);
        }
    }

    public ClearRenderables() {
        this.rendererables = [];
    }

    public async Prepare(camera: Camera) {

        if(!this.renderer.hasInitialized) return Debug.Error("Could not prepare the scene because the renderer has not been initialized.", [
            "Make sure to call 'await [name of renderer].Initialize()' before preparing the scene."
        ], ErrorCodes.WGPURSCENE_RENDERER_NOT_INITIALIZED)

        const startTimestamp: number = Date.now();

        const renderer: WebGPURenderer = this.renderer,
            rendererables = this.rendererables,
            amountOfRenderables = rendererables.length;

        for(let i = 0; i < amountOfRenderables; i++) {
            
            const renderable = rendererables[i];

            await renderable.Initialize(renderer.gpuDevice, renderer.format, renderer.options.msaaSampleCount ?? 1);
        }

        camera.EnsureBinding(this.renderer.gpuDevice);

        const stopTimestamp: number = Date.now(),
            timeDifferenceInMs: number = stopTimestamp - startTimestamp;

        this.hasPrepared = true;
            
        return Debug.Log("Succesfully prepared renderables.", [
            `Amount of renderables: ${amountOfRenderables}`,
            `Prepared in ${timeDifferenceInMs} milliseconds.`
        ]);
    }
}