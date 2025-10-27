import { WebGPUEnsureState } from "../typings";

export async function EnsureWebGPU(): Promise<WebGPUEnsureState> {

    if(!("gpu" in navigator)) return {
        ok: false,
        reason: "Browser does not support WebGPU yet.",
    }

    try {

        // Try to request a GPU adapter.
        const adapter = await navigator.gpu.requestAdapter();

        if(!adapter) return {
            ok: false,
            reason: "No available GPU adapter found."
        }

        // Try to get the gpu device.
        try {
            await adapter.requestDevice();
        } catch(requestDeviceError) {
            return {
                ok: false,
                reason: "Could not request a GPU device.",
                error: requestDeviceError as Error
            }
        }

        // All cases passes and should be fine to use WebGPU.
        return { ok: true }

    } catch(e) {
        return {
            ok: false,
            reason: "Unknown WebGPU error",
            error: e as Error
        }
    }
}