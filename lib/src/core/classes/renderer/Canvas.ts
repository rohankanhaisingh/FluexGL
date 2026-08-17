import { Mouse } from "@fluex-gl/testtypings";
import { v4 } from "uuid";
import { Vec2 } from "../math/Vector2";

export interface CanvasOptions {
    width?: number;
    height?: number;
    styles?: string;
    fullScreen?: boolean;
}

export interface CanvasEventMap {
    "mouseDown": (mouse: Mouse, event: MouseEvent) => void;
    "mouseUp": (mouse: Mouse, event: MouseEvent) => void;
    "mouseEnter": (mouse: Mouse, event: MouseEvent) => void;
    "mouseLeave": (mouse: Mouse, event: MouseEvent) => void;
    "mouseMove": (mouse: Mouse, event: MouseEvent) => void;
}

export type CanvasEvents = {
    [K in keyof CanvasEventMap]: CanvasEventMap[K][];
}

export class Canvas {

    public width: number = 600;
    public height: number = 400;
    public fullScreen: boolean = false;
    public id: string = v4();

    public htmlCanvasElement: HTMLCanvasElement | null = null;
    public anchoredElement: HTMLElement | null = null;

    public mouse: Mouse = {
        isInWindow: false,
        buttons: {
            left: {
                isActive: false
            },
            middle: {
                isActive: false
            },
            right: {
                isActive: true
            }
        },
        position: Vec2.zero()
    }

    private events: CanvasEvents = {
        "mouseDown": [],
        "mouseUp": [],
        "mouseLeave": [],
        "mouseEnter": [],
        "mouseMove": []
    }

    constructor(options: CanvasOptions = {}) {

        this.width = options.width ?? this.width;
        this.height = options.height ?? this.height;
        this.fullScreen = options.fullScreen ?? this.fullScreen;

        this.htmlCanvasElement = document.createElement("canvas");
        this.htmlCanvasElement.width = this.width;
        this.htmlCanvasElement.height = this.height;
        this.htmlCanvasElement.style = options.styles ?? "";

        this.htmlCanvasElement.setAttribute("fluexgl-id", this.id);

        this.htmlCanvasElement.addEventListener("mousedown", (event: MouseEvent) => this.htmlCanvasElementOnMouseDown(event));
        this.htmlCanvasElement.addEventListener("mouseup", (event: MouseEvent) => this.htmlCanvasElementOnMouseUp(event));
        this.htmlCanvasElement.addEventListener("mouseenter", (event: MouseEvent) => this.htmlCanvasElementOnMouseEnter(event));
        this.htmlCanvasElement.addEventListener("mouseleave", (event: MouseEvent) => this.htmlCanvasElementOnMouseLeave(event));
        this.htmlCanvasElement.addEventListener("mousemove", (event: MouseEvent) => this.htmlCanvasElementOnMouseMove(event));

        window.addEventListener("resize", () => { this.windowOnResize() });
    }

    private windowOnResize() {
        this.anchoredElement && this.resizeCanvasToAnchoredElement();
    }

    private htmlCanvasElementOnMouseMove(event: MouseEvent) {
        this.mouse.position.x = event.clientX;
        this.mouse.position.y = event.clientY;

        for(const cb of this.events.mouseMove)
            cb(this.mouse, event);
    }

    private htmlCanvasElementOnMouseDown(event: MouseEvent) {
        switch (event.button) {
            case 0: this.mouse.buttons.left.isActive = true; break;
            case 1: this.mouse.buttons.middle.isActive = true; break;
            case 2: this.mouse.buttons.right.isActive = true; break;
        }

        for(const cb of this.events.mouseDown)
            cb(this.mouse, event);
    }

    private htmlCanvasElementOnMouseUp(event: MouseEvent) {
        switch (event.button) {
            case 0: this.mouse.buttons.left.isActive = false; break;
            case 1: this.mouse.buttons.middle.isActive = false; break;
            case 2: this.mouse.buttons.right.isActive = false; break;
        }
        
        for(const cb of this.events.mouseUp)
            cb(this.mouse, event);
    }

    private htmlCanvasElementOnMouseEnter(event: MouseEvent) {
        this.mouse.isInWindow = true;

        for(const cb of this.events.mouseEnter)
            cb(this.mouse, event);
    }

    private htmlCanvasElementOnMouseLeave(event: MouseEvent) {
        this.mouse.isInWindow = false;

        for(const cb of this.events.mouseLeave)
            cb(this.mouse, event);
    }

    private resizeCanvasToAnchoredElement() {

        if (!this.anchoredElement)
            throw new Error("Could not resize canvas to the anchored element since the anchored element has not been defined.");

        const domRect: DOMRect = this.anchoredElement?.getBoundingClientRect();
        this.setSize(domRect.width, domRect.height);
    }

    public setSize(width?: number, height?: number): Canvas {

        if (!this.htmlCanvasElement)
            throw new Error("Could not set the size on canvas element, because it's null.");

        this.width = width ?? this.width;
        this.height = height ?? this.height;
        this.htmlCanvasElement.width = this.width;
        this.htmlCanvasElement.height = this.height;

        return this;
    }

    /**
     * Appends this canvas to a HTML element making the canvas visible to the user.
     * @param htmlElement 
     * @returns 
     */
    public appendTo(htmlElement: HTMLElement, anchor?: boolean): Canvas {

        if (!this.htmlCanvasElement)
            throw new Error("Could not append this canvas to the specified element, since the canvas element has not been created yet.");

        if (anchor)
            this.anchoredElement = htmlElement;

        htmlElement.appendChild(this.htmlCanvasElement);
        return this;
    }

    public addEventListener<K extends keyof CanvasEventMap>(event: K, cb: CanvasEventMap[K]): () => void {

        this.events[event].push(cb);
        return () => this.removeEventListener(event, cb);
    }

    public once<K extends keyof CanvasEventMap>(event: K, cb: CanvasEventMap[K]): () => void {

        const wrapper = ((...args: unknown[]) => {

            // @ts-ignore
            cb(...args);
            this.removeEventListener(event, wrapper as unknown as CanvasEventMap[K]);
        }) as unknown as CanvasEventMap[K];

        return this.addEventListener(event, wrapper);
    }

    public removeEventListener<K extends keyof CanvasEventMap>(event: K, cb: CanvasEventMap[K]): Canvas {

        const arr = this.events[event];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === cb) {
                arr.splice(i, 1);
                break;
            }
        }
        return this;
    }

    public clearEventListeners(event?: keyof CanvasEventMap): Canvas {

        if (event) {
            this.events[event].length = 0;
        } else {
            (Object.keys(this.events) as (keyof CanvasEventMap)[]).forEach((k) => (this.events[k].length = 0));
        }

        return this;
    }
}