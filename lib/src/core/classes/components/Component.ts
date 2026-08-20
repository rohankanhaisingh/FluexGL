import { v4 } from "uuid";

import { RenderObject } from "./RenderObject";

export abstract class Component {

    public readonly id: string = v4();

    protected renderObject: RenderObject | null = null;

    public onAttach(renderObject: RenderObject): void {
        this.renderObject = renderObject;
    }

    public onDetach(): void {
        this.renderObject = null;
    }
}