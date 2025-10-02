import { v4 } from "uuid";

import { Debug } from "../../utilities/debugging/console";
import { ThreadEventMap, ThreadEvents } from "../../typings";
import { ErrorCodes, WarningCodes } from "../../codes";

export class Thread {

    public id: string = v4();

    public simulationUpdateRate: number = 60;
    public frameRate: number = 0;
    public deltaTime: number = 0;

    public currentRegisteredTimestamp: number = Date.now();
    public lastRegisteredTimestamp: number = Date.now();
    private startTimestamp: number = Date.now();

    /** Event registry. */
    public events: ThreadEvents = {
        idle: [],
        start: [],
        stop: [],
        update: [],
    };

    public isActive: boolean = false;

    private animationFrame: number = 0;
    private times: number[] = [];
    private maxDeltaMs: number = 250;

    private loop = (rafTime: number) => {

        if (!this.isActive) return;

        this.animationFrame = window.requestAnimationFrame(this.loop);

        const now = Date.now();

        const rawDeltaMs = now - this.lastRegisteredTimestamp;

        const deltaMs = Math.min(rawDeltaMs, this.maxDeltaMs);
        const deltaSec = deltaMs / 1000;
        const dt = deltaSec * this.simulationUpdateRate;

        this.deltaTime = dt;
        this.lastRegisteredTimestamp = now;
        this.currentRegisteredTimestamp = now;

        while (this.times.length > 0 && this.times[0] <= now - 1000) {
            this.times.shift();
        }
        this.times.push(now);
        this.frameRate = this.times.length;

        type UpdatePayload = Parameters<ThreadEventMap["update"]>[0];

        const payload: UpdatePayload = {
            now,
            deltaTime: this.deltaTime,
            frameRate: this.frameRate,
            lastRegisteredTimestamp: this.lastRegisteredTimestamp,
            simulationUpdateRate: this.simulationUpdateRate
        } as UpdatePayload;

        this.events.update.forEach((fn) => fn(payload));
    };

    /**
     * Creates a new Thread instance.
     *
     * A Thread represents a self-managed game/render loop that uses
     * `requestAnimationFrame` under the hood. It maintains timing state such as
     * `deltaTime`, `frameRate`, and normalized simulation steps based on the
     * configured {@link simulationUpdateRate}.
     *
     * By default:
     * - `simulationUpdateRate` = 60 ticks per second
     * - `maxDeltaMs` = 250 ms (clamps large frame gaps to prevent huge dt values)
     * - All event registries (`start`, `stop`, `idle`, `update`) are empty
     * - The loop is inactive until {@link StartLoop} is called
     *
     * Example:
     * ```ts
     * const thread = new Thread();
     * thread.AddEventListener("update", (e) => {
     *   console.log(`Frame update: dt=${e.deltaTime}, fps=${e.frameRate}`);
     * });
     * thread.StartLoop();
     * ```
     */
    constructor() {}

    /**
     * Starts the RAF loop and emits "start".
     *
     * @returns this
     */
    public Start(): Thread {

        if (this.isActive) {
            Debug.Warn("Could not start thread loop because it is already active.", [
                "Call method Stop() before starting again.",
            ], WarningCodes.THREAD_ALREADY_ACTIVE);
            return this;
        }

        this.isActive = true;
        this.startTimestamp = Date.now();
        this.lastRegisteredTimestamp = this.startTimestamp;
        this.currentRegisteredTimestamp = this.startTimestamp;
        this.times.length = 0;
        this.frameRate = 0;

        this.events.start.forEach((ev) => ev());
        this.animationFrame = window.requestAnimationFrame(this.loop);
        return this;
    }

    /**
     * Stops the RAF loop and emits "stop" followed by "idle".
     *
     * @returns this
     */
    public Stop(): Thread {

        if (!this.isActive) {
            Debug.Warn("Could not stop the thread loop because it is already inactive.", [
                "Call method Start() before stopping again.",
            ], WarningCodes.THREAD_ALREADY_INACTIVE);
            return this;
        }

        this.isActive = false;

        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = 0;
        }

        this.events.stop.forEach((ev) => ev());
        this.events.idle.forEach((ev) => ev());

        return this;
    }

    /**
     * Sets the simulation update rate (ticks per second) used to normalize `dt`.
     *
     * @param rate Updates per second (e.g., 60).
     * @returns this
     */
    public SetSimulationUpdateRate(rate: number): Thread {

        if (!Number.isFinite(rate) || rate <= 0) {

            Debug.Error(`SetSimulationUpdateRate: invalid rate "${rate}".`, [
                "Rate must be a positive number greater than zero.",
                `Received: ${rate}`
            ], ErrorCodes.THREAD_INVALID_SIMULATION_UPDATE_RATE);
            return this;
        }

        this.simulationUpdateRate = rate;
        return this;
    }

    /**
     * Sets a maximum delta in milliseconds to clamp long frames (avoids huge `dt`).
     *
     * @param ms Maximum delta in milliseconds (default ~250ms).
     * @returns this
     */
    public SetMaxDeltaMs(ms: number): Thread {

        if (!Number.isFinite(ms) || ms <= 0) {
            
            Debug.Error(`SetMaxDeltaMs: invalid value "${ms}".`, [
                "Value must be a positive number greater than zero.",
                `Received: ${ms}`
            ], ErrorCodes.THREAD_INVALID_DELTA_TIME);
            return this;
        }
        
        this.maxDeltaMs = ms;
        return this;
    }

    /**
     * Adds an event listener.
     *
     * @example
     * ```ts
     * const unsubscribe = thread.AddEventListener("update", (e) => { ... });
     * // later:
     * unsubscribe();
     * ```
     *
     * @param event Event name.
     * @param cb Listener callback.
     * @returns Unsubscribe function.
     */
    public AddEventListener<K extends keyof ThreadEventMap>(event: K, cb: ThreadEventMap[K]): () => void {

        this.events[event].push(cb);

        return () => this.RemoveEventListener(event, cb);
    }

    /**
     * Adds a one-time event listener that auto-removes itself after the first call.
     *
     * @param event Event name.
     * @param cb Listener callback.
     * @returns Unsubscribe function (noop after it fires).
     */
    public Once<K extends keyof ThreadEventMap>(event: K, cb: ThreadEventMap[K]): () => void {

        const wrapper = ((...args: unknown[]) => {

            // @ts-ignore
            cb(...args);

            this.RemoveEventListener(event, wrapper as unknown as ThreadEventMap[K]);
        }) as unknown as ThreadEventMap[K];

        return this.AddEventListener(event, wrapper);
    }

    /**
     * Removes a previously added event listener.
     *
     * @param event Event name.
     * @param cb The same function reference that was added.
     * @returns this
     */
    public RemoveEventListener<K extends keyof ThreadEventMap>(event: K, cb: ThreadEventMap[K]): Thread {

        const arr = this.events[event];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === cb) {
                arr.splice(i, 1);
                break;
            }
        }
        return this;
    }

    /**
     * Removes all listeners for a given event (or for all events if omitted).
     *
     * @param event Optional event name to clear; clears all if omitted.
     * @returns this
     */
    public ClearEventListeners(event?: keyof ThreadEventMap): Thread {

        if (event) {
            this.events[event].length = 0;
        } else {
            (Object.keys(this.events) as (keyof ThreadEventMap)[]).forEach((k) => (this.events[k].length = 0));
        }

        return this;
    }

    /** Whether the loop is currently running. */
    public get IsRunning(): boolean {
        return this.isActive;
    }
}