import { v4 } from "uuid";

export interface CanvasOptions {
    width?: number;
    height?: number;
    styles?: string;
    fullScreen?: boolean;
}

export class Canvas {

    public width: number = 600;
    public height: number = 400;
    public fullScreen: boolean = false;
    public id: string = v4();

    public htmlCanvasElement: HTMLCanvasElement | null = null;
    public anchoredElement: HTMLElement | null = null;

    constructor(options: CanvasOptions = {}) {

        this.width = options.width ?? this.width;
        this.height = options.height ?? this.height;
        this.fullScreen = options.fullScreen ?? this.fullScreen;

        this.htmlCanvasElement = document.createElement("canvas");
        this.htmlCanvasElement.width = this.width;
        this.htmlCanvasElement.height = this.height;
        this.htmlCanvasElement.style = options.styles ?? "";

        this.htmlCanvasElement.setAttribute("fluexgl-id", this.id);

        window.addEventListener("resize", () => { this.windowOnResize() });
    }

    private windowOnResize() {
        this.anchoredElement && this.resizeCanvasToAnchoredElement();
    }
    
    private resizeCanvasToAnchoredElement() {

        if(!this.anchoredElement) 
            throw new Error("Could not resize canvas to the anchored element since the anchored element has not been defined.");
        
        const domRect: DOMRect = this.anchoredElement?.getBoundingClientRect();
        this.setSize(domRect.width, domRect.height);
    }

    public setSize(width?: number, height?: number): Canvas {

        if(!this.htmlCanvasElement) 
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

        if(!this.htmlCanvasElement)
            throw new Error("Could not append this canvas to the specified element, since the canvas element has not been created yet.");
        
        if(anchor)
            this.anchoredElement = htmlElement;

        htmlElement.appendChild(this.htmlCanvasElement);
        return this;
    }
}